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
import * as filters from "./filters";

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
    const filterKeys = Object.keys(filters);
    const availableFilters = filterKeys.join("\n");
    console.log(`Available filters: \n${availableFilters}`);
    rl.question("Enter the name of the desired filter: ", async (answer: string) => {
        if (filterKeys.includes(answer)) {
            await main(answer as Filter);
            rl.close();
        } else {
            console.log("Invalid filter");
            askForFilter();
        }
    });
}

askForFilter();
