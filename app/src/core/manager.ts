import { AppDatabase } from './app-database';

export abstract class Manager {
    protected database: AppDatabase;

    constructor(database: AppDatabase) {
        this.database = database;
    }

    protected abstract loadFromDB(): Promise<void>;
    protected abstract registerListeners(): void;

    public abstract saveToDB(): Promise<boolean>;

    public async ready(): Promise<void> {
        await this.loadFromDB();
        this.registerListeners();
    }
}
