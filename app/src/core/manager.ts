import { AppDatabase } from './app-database';

export abstract class Manager {
    protected database: AppDatabase;

    constructor(database: AppDatabase) {
        this.database = database;
    }

    protected abstract loadFromDB(): Promise<void>;
    protected abstract registerListeners(): void;

    public abstract saveToDB(): Promise<boolean>;

    public ready(): void {
        this.registerListeners();
        this.loadFromDB();
    }
}
