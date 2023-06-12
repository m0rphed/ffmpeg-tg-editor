import path from 'path';

export const getBotToken = (): string => {
    // check that telegram token env variable is set
    if (!process.env.TG_BOT_TOKEN?.toString()) {
        throw new Error(
            'Error: environment variable `TG_BOT_TOKEN` was not set'
        );
    }

    // return telegram bot token string value
    return process.env.TG_BOT_TOKEN.toString();
}

export const getConfig = (fullPath?: string) => {
    const defaultPath = path.join(process.cwd(), 'data');
    const exactPath = fullPath ?? defaultPath;
    return {dataDirPath: exactPath};
}

export const parseFloatNum = (numericStr: string) => {
    const parsedValue = parseFloat(numericStr);
    if (isNaN(parsedValue)) {
        throw new Error(
            `Error: failed to parse float number from string value: '${numericStr}'`
        );
    }

    return parsedValue;
}