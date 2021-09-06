import { Task } from '../Task';
export class WalmartCATask extends Task {
    async doTask(): Promise<void> {
        try {
            console.log('Not implemented');
        } catch (e) {
            throw new Error();
        }
    }
}
