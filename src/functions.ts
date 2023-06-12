import {getConfig, parseFloatNum} from './bot_utils.js';
import path from 'path';
import {Bot, Context, InputFile} from 'grammy';
import {Message} from '@grammyjs/types';
import {FileFlavor, hydrateFiles} from '@grammyjs/files';
import {FFmpeg} from '@ffmpeg.wasm/main';
import {FFmpegOpts, mp4ToGif} from './ffmpeg.js';

// transformative Context flavor
export type VideoFileContext = FileFlavor<Context>;

// send file with specified path to the user
const sendVideoToUser = async (ctx: Context, pathToGif: string) => {
    try {
        const video = new InputFile(pathToGif);
        await ctx.replyWithVideo(video);
    } catch (error) {
        console.error('Error sending file:', error);
    }
}

export const initFileBot = (token: string) => {
    // create the Telegram bot instance
    const bot = new Bot<VideoFileContext>(token);
    // use the plugin for downloading files.
    bot.api.config.use(hydrateFiles(bot.token));
    return bot;
}

export const convertVideoToGif = (ffmpegInst: FFmpeg) => {
    return async function (ctx: VideoFileContext) {
        const message = ctx.message as Message.TextMessage;
        const commandArguments = message.text.split(' ');
        // TODO:
        //  validate command arguments:
        //      - duration should be number,
        //      - start time should match a special regex ...
        const startTime = commandArguments[1];
        const duration = commandArguments[2];
        console.log(`[command "toGif"] got start-time:${startTime}; duration:${duration}`);

        // get default directory for videos
        const {dataDirPath} = getConfig();

        console.log('[command "toGif"] waiting for file...');
        // prepare the file for download.
        const inputFile = await ctx.getFile();

        // download the file to directory where all video data should be stored
        const inputPath = await inputFile.download(dataDirPath);
        console.log('[command "toGif"] Downloaded input file: ', inputFile);

        const videoFileName = inputFile.file_unique_id + '.gif';
        const outputPath = path.join(dataDirPath, videoFileName)
        console.log(`[command "toGif"] Output file: ${videoFileName}, path: ${outputPath}`);

        const opts: FFmpegOpts = {
            timeStart: startTime,
            duration: parseFloatNum(duration),
            outFormat: 'gif'
        }

        await mp4ToGif(ffmpegInst, inputPath, outputPath, opts);

        // send the GIF file back to the user
        await sendVideoToUser(ctx, outputPath);
    }
}