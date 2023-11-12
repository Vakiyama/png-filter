import {
    workerData,
    parentPort,
    isMainThread,
    Worker,
} from 'worker_threads';
import { Filter } from './IOHandler';
import * as filters from './filters';

export default function filterWithWorker(
    data: Buffer,
    filter: Filter,
): Promise<Buffer> | void {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: {
                data,
                filter,
            },
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

if (!isMainThread) {
    const { data, filter } = workerData as { data: Buffer, filter: Filter };
    const filteredData = filters[filter](data);
    parentPort!.postMessage(filteredData);
}


