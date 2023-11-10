/*
 * Project: Milestone 1
 * File Name: IOhandler.ts
 * Description: Collection of functions for files input/output related operations
 */

import AdmZip from "adm-zip";
import {
    readdir,
} from "fs/promises";
import { 
    createReadStream,
    createWriteStream,
} from "fs";
import { pipeline } from "stream";
import { PNG } from "pngjs";
import path from "path";

export type Filter = (this: PNG) => Buffer;

/**
 * Description: decompress file from given pathIn, write to given pathOut
 */
export function unzip(pathIn: string, pathOut: string): void {
    const zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut, true);
    console.log("Extraction operation complete");
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 */
export async function readDir(dir: string): Promise<string[]> {
    const dirs = await readdir(dir);
    const paths = dirs.filter((file) => path.extname(file) === ".png");
    return paths.map((file) => path.join(dir, file));
}

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 */
export async function filterPNG(
    pathIn: string,
    pathOut: string,
    filter: Filter,
): Promise<void> {
    pipeline(
        createReadStream(pathIn),
        await createFilterTransformStream(filter),
        createWriteStream(pathOut),
        handlePngError,
   );
}

function handlePngError(err: Error | null) {
    if (err) console.log(err);
}

async function createFilterTransformStream(filter: Filter) {
    const pngTransform = new PNG({ filterType: 4 });
    return pngTransform.on("parsed", function (this: PNG) {
            const newData = filter.call(pngTransform);
            this.data = newData;
            this.pack()
        });
}

