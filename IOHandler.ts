/*
 * Project: Milestone 1
 * File Name: IOhandler.ts
 * Description: Collection of functions for files input/output related operations
 */

import unzipper from "unzip";
import {
    createReadStream,
} from "fs";
import { promisify } from "util";
import { pipeline } from "stream";
import PNG from "pngjs";
import path from "path";

const asyncPipeline = promisify(pipeline);

/**
 * Description: decompress file from given pathIn, write to given pathOut
 */
export async function unzip(pathIn: string, pathOut: string): Promise<void> {
    await asyncPipeline( 
        createReadStream(pathIn),
        unzipper.Extract({ path: pathOut }),
    );
    console.log('Extraction operation complete');
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 */
export async function readDir(dir: string): Promise<string[]> {
    return [];
}

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 */
export async function grayScale(pathIn: string, pathOut: string): Promise<void> {
}
