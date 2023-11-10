import path from "path";
import readline from "readline";
import { stdin, stdout } from "process";
import { fileURLToPath } from "url";
import { 
    unzip,
    readDir,
    filterPNG,
    Filter,
} from "./IOHandler";
import filters from "./filters.ts";

const rl = readline.createInterface({ input: stdin, output: stdout });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "filtered");

async function main(filter: Filter) {
    try {
        unzip(zipFilePath, pathUnzipped);
        const paths = await readDir(pathUnzipped);
        for (const dirPath of paths) {
            const outPath = path.join(pathProcessed, path.basename(dirPath));
            await filterPNG(dirPath, outPath, filter);
        }
        console.log("All files processed");
    } catch (err) {
        console.log(err);
    }
}

function askForFilter() {
    const availableFilters = Object.keys(filters).join("\n");
    console.log(`Available filters: \n${availableFilters}`);
    rl.question("Enter the name of the desired filter: ", async (answer: string) => {
        // @ts-ignore
        const filter = filters[answer];
        if (filter) {
            await main(filter);
            rl.close();
        } else {
            console.log("Invalid filter");
            askForFilter();
        }
    });
}

askForFilter();
