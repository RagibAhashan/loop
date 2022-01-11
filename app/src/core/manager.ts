export abstract class Manager {
    constructor() {}

    protected abstract loadFromDB(): Promise<void>;
    protected abstract registerListeners(): void;

    public async ready(): Promise<void> {
        await this.loadFromDB();
        this.registerListeners();
    }
}
