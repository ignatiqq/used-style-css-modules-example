import React from "react";
import path from "path";
import fs, { stat } from 'fs';
import { renderToPipeableStream } from "react-dom/server";
import { createStyleStream, discoverProjectStyles } from "used-styles";
import { StaticRouter } from 'react-router-dom/server';

import express from "express";

import Routes from "../client/routes.js";
import { ChunkLoadingTracker, getChunkLoadingTracker } from "../libs/chunkLoadingTrackerJs";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.static("./build/client"));

const BOOTSTRAP_BEFORE_HYDRATE_SCRIPT_STRING =
  'typeof window._HYDRATE === "function" ? window._HYDRATE() : (window._HYDRATE = true)';

const stylesLookup = discoverProjectStyles("build/client/css");

function getImportedStats(path) {
  let stats;

  return () => {
    if(!!stats) return stats;

    const file = fs.readFile(path);
    stats = file;
    return stats;
  }
}

app.get("*", async (request, response) => {
  try {
    await stylesLookup;
    const stats = getImportedStats('./imported.json');

    console.log({stylesLookup, lookup: stylesLookup.lookup});

    const chunkStats = getChunkLoadingTracker(stats);

    const styleStream = createStyleStream(stylesLookup, (file) => {
      console.log({ file, shouldBeLoaded: chunkStats.chunkShouldBeLoaded.has(file), stats: chunkStats.chunkShouldBeLoaded});
      if(!chunkStats.chunkShouldBeLoaded.has(file)) return;
      return `<link rel="stylesheet" href="/css/${file}" data-used-style />`;
    });
  
    response.write(
      `<html>
      <head>
        <title>React Streaming SSR</title>
        <script type="module" async src="index.js"></script>
      </head>
      `
    );

    let didError;
  
    const stream = renderToPipeableStream(
        <body>
          <div id="root">
            <StaticRouter location={request.url}>
              <Routes />
            </StaticRouter>
          </div>
        </body>,
      {
        bootstrapScriptContent: BOOTSTRAP_BEFORE_HYDRATE_SCRIPT_STRING,
        onShellReady() {
          response.statusCode = didError ? 500 : 200;
          stream.pipe(styleStream).pipe(response);
        },
        onAllReady() {
        },
        onError(err) {
          console.log("On error", err);
          didError = true;
          response.statusCode = 500;
          response.end('<h1>Error occured</h1>')
        }
      }
    );
  
    setTimeout(() => {
      stream.abort();
    }, 10000); 
  } catch (error) {
    response.end('<h1>Error occured</h1>')
    console.log({error});
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
