import React from "react";
import { importAssets } from "webpack-imported";

export class ChunkLoadingTracker {

    constructor(stats) {
        console.log({stats})
        this.stats = stats;
        // stats = webpack-imported stats file
        this.requestedChunks = new Map();
        this.collect = this.collect.bind(this);
    }

    // // collect by chunk
    // collect(chunkName: string) {
    //     const {styles} = importAssets(this.stats, chunkName);
    //     // should be loaded stats
    //     const stats = styles.load;

    //     this.requestedChunks.set(chunkName, stats);
    // }

    // это решение лучше, так как после импорта ассетов для чанка мы всегда будем держать
    // только действительно нужные стили для чанков
    // и можем проверять заргужать стили или нет (из стрима) сверив их с chunkShouldBeLoaded
    collect(chunkName) {
        // remove this str only for my project
        if(!this.stats) return;

        const {styles} = importAssets(this.stats, chunkName);
        const stats = styles.load;

        console.log("collector.collect", {styles, stats})

        for(let chunk of stats) {
            this.chunkShouldBeLoaded.add(chunk);
        }
    }
}

// in stream
// we cant use it in alterProjectStyles because of we need STREAM

// const instance = new ChunkLoadingTracker();

// const styleStream = createStyleStream((chunk: string) => {
//     // avoid adding style to stream because of it shouldnot load
//     // we should return empty string because 'used-styles' anyway will concat it with chunk
//     if(!instance.chunkShouldBeLoaded.has(chunk)) return '';
//     return createLink(chunk);
// });


// ####################### import decorator flow 

// returns module
// type LoadFnType = () => Promise<any>;
// type TrackLoadedChunkCallbackType = (name: string) => void;
/**
 * decorator for chunk loader
 * which notify which chunk name whould be loaded
 * actually only need for server
 * @param name - name of chunk which will be loaded
 */
export const trackLoadedChunk = (loadFn, name, callback) => {
    const promise = React.lazy(loadFn());

    // first of all request fot chunk
    // because of callback has slow sync calculcations
    callback(name);

    return promise;

    // should we track chunk only if it's loaded?
    // callback().then((module) => {
    //    callback(name);
    //    resolve(module);
    // })
}

export const getChunkLoadingTracker = (() => {
    let instance;

    return (stats) => {
        console.log({stats})
        if(!!instance) return instance;
        instance = new ChunkLoadingTracker(stats);
        return instance;
    }
})();

export const dynamicLoad = (function () {
    console.log({win: typeof window})
    if(typeof window === 'undefined') {
        return (loadFn, name) => {
            console.log("CALL")
            return trackLoadedChunk(loadFn, name, getChunkLoadingTracker().collect)
        };
    }

    return (loadFn) => {
        console.log({clientLoadFn: loadFn})
        return React.lazy(() => loadFn());
    }
})();
