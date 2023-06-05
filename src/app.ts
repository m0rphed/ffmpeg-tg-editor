import path from 'path'
import { writeFile, } from "fs/promises";
import { FFmpeg, createFFmpeg, fetchFile } from "@ffmpeg.wasm/main";
import { Bot, Context } from 'grammy';

type FFmpegOpts = {
    start_time: [boolean, string];
    end_time: [boolean, string];
    duration: number;
    video_c: [boolean, string];
    audio_c: [boolean, string];
    out_format: string;
}

const mp4ToGif = async function (ffmpegInstance: FFmpeg, inFile: string, outFile: string, dir: string, opts: FFmpegOpts | null = null) {
    await ffmpegInstance.load();

    console.log('Loading ffmpeg...');
    console.log('=> is loaded: ', ffmpegInstance.isLoaded());

    ffmpegInstance.FS('writeFile', inFile, await fetchFile(path.join(dir, inFile)));

    await ffmpegInstance.run('-i', inFile, '-t', '5.5', '-ss', '0', '-f', 'gif', outFile);

    const resData = ffmpegInstance.FS('readFile', outFile);
    await writeFile(path.join(dir, outFile), resData);

    console.log('- finished -');
}

const cwd = process.cwd();
const dataDirName = 'data';
const resolvedPath = path.join(cwd, dataDirName);

const inName = 'test.mp4';
const outName = 'out.gif';

const ffmpegInstance = createFFmpeg({ log: false });

await mp4ToGif(ffmpegInstance, inName, outName, resolvedPath);
console.log('end');
// process.exit(0);