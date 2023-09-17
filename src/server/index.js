import React from "react";
import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import { createStyleStream, discoverProjectStyles } from "used-styles";
import { StaticRouter } from 'react-router-dom/server';

import express from "express";

import Routes from "../client/routes.js";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.static("./build/client"));

const BOOTSTRAP_BEFORE_HYDRATE_SCRIPT_STRING =
  'typeof window._HYDRATE === "function" ? window._HYDRATE() : (window._HYDRATE = true)';

const stylesLookup = discoverProjectStyles("build/client/css");

app.get("*", async (request, response) => {
  try {
    await stylesLookup;

    console.log({stylesLookup, lookup: stylesLookup.lookup});

    const styleStream = createStyleStream(stylesLookup, (file) => {
      console.log({ file });
      return `<link rel="stylesheet" href="/${file}" data-used-style />`;
    });
  
    let didError;
  
    const stream = renderToPipeableStream(
      <html>
        <head>
          <title>React Streaming SSR</title>
          <script type="module" async src="index.js"></script>
        </head>
        <body>
          <div id="root">
            <StaticRouter location={request.url}>
              <Routes />
            </StaticRouter>
          </div>
        </body>
      </html>,
      {
        bootstrapScriptContent: BOOTSTRAP_BEFORE_HYDRATE_SCRIPT_STRING,
        onShellReady() {
          console.log("on shell ready")
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
