import {initFileBot, convertVideoToGif} from './functions.js';
import {getBotToken} from './bot_utils.js';
import {getFFmpegInst} from './ffmpeg.js';

const bot = initFileBot(getBotToken());
const ffmpegInst = getFFmpegInst();

// handle '/toGif' bot command
bot.command('toGif', convertVideoToGif(ffmpegInst));
await bot.start();
