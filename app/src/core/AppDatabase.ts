import { app } from 'electron';
import { open } from 'fs/promises';
import { debug } from './Log';

const log = debug.extend('AppDatabase');

export class AppDatabase {
    // TODO accounts, captcha solvers, settings,

    static APP_PATH = app.getPath('appData');

    constructor() {}

    public async loadModelDB<T>(modelName: string): Promise<T[] | null> {
        try {
            const modelDB = await open(`${AppDatabase.APP_PATH}/dynasty.${modelName}.db`, 'r');
            const modelString = await modelDB.readFile({ encoding: 'utf-8' });

            log('Loaded %s json %s', modelName, modelString);

            return JSON.parse(modelString);
        } catch {
            log('%s DB non existent', modelName);
            return null;
        }
    }

    public async saveModelDB<T>(modelName: string, model: T[]): Promise<boolean> {
        const modelDB = await open(`${AppDatabase.APP_PATH}/dynasty.${modelName}.db`, 'w');
        const modelString = JSON.stringify(model);
        modelDB.writeFile(modelString);
        log('Saved %s to DB', modelName);
        return true;
    }
}
