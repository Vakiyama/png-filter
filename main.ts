import path from "path";
import { fileURLToPath } from "url";
import { 
    unzip,
    readDir,
    grayScale,
} from "./IOHandler";

/*
 * Project: Milestone 1
 * File Name: main.js
 *
 * Created Date: 
 * Author: Vitor Akiyama
 *
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

async function main() {
    try {
        await unzip(zipFilePath, pathUnzipped);
    } catch (err) {
        console.error(err);
    }
}

main();
