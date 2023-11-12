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
import filterWithWorker from "./workers";
import * as filters from "./filters";

export type Filter = keyof typeof filters;

export function unzip(pathIn: string, pathOut: string): void {
    const zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut, true);
    console.log("Extraction operation complete");
}

export async function readDir(dir: string): Promise<string[]> {
    const dirs = await readdir(dir);
    const paths = dirs.filter((file) => path.extname(file) === ".png");
    return paths.map((file) => path.join(dir, file));
}

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
    return pngTransform.on("parsed", async function (this: PNG) {
            const newData = await filterWithWorker(this.data, filter);
            if (newData === undefined) {
                throw new Error("Fatal: worker was potentially called from main thread");
            }
            this.data = newData;
            this.pack()
        });
}

