import {writeFile} from 'fs/promises';
import {FFmpeg, fetchFile, createFFmpeg} from '@ffmpeg.wasm/main';

export type FFmpegOpts = {
    timeStart: string;
    timeEnd?: string;
    duration: number;
    cVideo?: string;
    cAudio?: string;
    outFormat: string;
};

const runFFmpeg = async function (ffmpegInst: FFmpeg, inPath: string, outPath: string, opts: FFmpegOpts) {
    if (!ffmpegInst.isLoaded()) {
        // TODO: implement descent logging
        console.log('Loading ffmpeg...');
        await ffmpegInst.load();
        console.log('-> loaded: ', ffmpegInst.isLoaded());
    }

    // TODO: check that file is available
    ffmpegInst.FS('writeFile', inPath, await fetchFile(inPath));

    // TODO: check which options passed, decide which flags needed
    // run with duration flag
    await ffmpegInst.run(
        '-i', inPath,
        '-t', opts.duration.toString(),
        '-ss', opts.timeStart,
        '-f', opts.outFormat,
        outPath
    );

    await writeFile(outPath, ffmpegInst.FS('readFile', outPath));
    console.log('File was written to: ', outPath);
}

export const mp4ToGif = async function (ffmpegInst: FFmpeg, inPath: string, outPath: string, opts: FFmpegOpts | null = null) {
    const options = opts ?? {
        duration: 10.0,
        timeStart: '0.0',
        outFormat: 'gif'
    };

    await runFFmpeg(ffmpegInst, inPath, outPath, options);
    console.log('[mp4ToGif] finished');
};

export const getFFmpegInst = () => createFFmpeg({log: false});
