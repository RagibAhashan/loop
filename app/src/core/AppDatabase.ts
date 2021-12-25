import { app } from 'electron';
import { open } from 'fs/promises';
import { debug } from './Log';

const log = debug.extend('AppDatabase');

// Never change this
export type ModelName = 'Profile' | 'ProxySet' | 'TaskGroup' | 'Task' | 'Proxy';

export class AppDatabase {
    // TODO accounts, captcha solvers, settings,

    static APP_PATH = app.getAppPath();

    constructor() {}

    public async loadModelDB<T>(modelName: ModelName): Promise<T[] | null> {
        try {
            console.log(AppDatabase.APP_PATH);
            log('Opening %s', `${AppDatabase.APP_PATH}/dynasty.${modelName}.db`);

            const modelDB = await open(`${AppDatabase.APP_PATH}/dynasty.${modelName}.db`, 'r');
            const modelString = await modelDB.readFile({ encoding: 'utf-8' });

            await modelDB.close();

            log('Loaded %s json', modelName);
            return JSON.parse(modelString);
        } catch (error) {
            log('%s DB non existent %O', modelName, error);
            return null;
        }
    }

    public async saveModelDB<T>(modelName: string, model: T[]): Promise<boolean> {
        const modelDB = await open(`${AppDatabase.APP_PATH}/dynasty.${modelName}.db`, 'w');
        const modelString = JSON.stringify(model);
        await modelDB.writeFile(modelString);
        await modelDB.close();
        log('Saved %s to DB', modelName);
        return true;
    }
}
