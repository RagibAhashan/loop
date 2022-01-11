export abstract class Manager {
    constructor() {}

    protected abstract loadFromDB(): Promise<void>;
    protected abstract registerListeners(): void;

    public async ready(): Promise<void> {
        console.log('readying that shit');
        await this.loadFromDB();
        this.registerListeners();
    }
}
