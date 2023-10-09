
export class ChunkLoadingTracker {

    constructor(stats) {
        this.stats = stats;
        // stats = webpack-imported stats file
        this.requestedChunks = new Map();
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
        const {styles} = importAssets(this.stats, chunkName);
        const stats = styles.load;

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
    const promise = loadFn();

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