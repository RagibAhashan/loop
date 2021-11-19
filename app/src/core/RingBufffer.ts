export class RingBuffer<T> {
    private size: number;
    private index: number;
    private buffer: T[];

    constructor(stuff?: T[]) {
        this.index = 0;
        this.buffer = [];
        if (stuff) {
            this.initBuffer(stuff);
        }
    }

    public initBuffer(stuff: T[]) {
        this.buffer = stuff;
        this.size = this.buffer.length;
    }

    public fillBuffer(...stuff: T[]) {
        this.buffer.push(...stuff);
        this.size = this.buffer.length;
    }

    public clearBuffer() {
        this.buffer = [];
        this.size = 0;
        this.index = 0;
    }

    public next(): T {
        return this.buffer[this.index++ % this.size];
    }
}
