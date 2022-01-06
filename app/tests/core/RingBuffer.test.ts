import { RingBuffer } from '../../src/core/ring-buffer';
let service: RingBuffer<number>;

beforeEach(() => {
    service = new RingBuffer();
});
it('constructor should fill buffer when passed in arguments', () => {
    const obj = new RingBuffer([1, 2]);

    let next;
    next = obj.next();
    expect(next).toBe(1);

    next = obj.next();
    expect(next).toBe(2);
});

it('initBuffer should return right values', () => {
    service.initBuffer([1, 2, 3]);

    let next;
    next = service.next();
    expect(next).toBe(1);

    next = service.next();
    expect(next).toBe(2);

    next = service.next();
    expect(next).toBe(3);
});

it('fillBuffer should return right values', () => {
    service.fillBuffer(0, 2, 3);
    let next;
    next = service.next();
    expect(next).toBe(0);

    next = service.next();
    expect(next).toBe(2);

    next = service.next();
    expect(next).toBe(3);
});

it('next should return right values circular', () => {
    service.fillBuffer(0, 2);
    let next;
    next = service.next();
    expect(next).toBe(0);

    next = service.next();
    expect(next).toBe(2);

    next = service.next();
    expect(next).toBe(0);

    next = service.next();
    expect(next).toBe(2);
});

it('clearBuffer should clear buffer and set size to 0', () => {
    service.fillBuffer(0, 2);
    let next;
    next = service.next();
    expect(next).toBe(0);

    next = service.next();
    expect(next).toBe(2);

    service.clearBuffer();

    next = service.next();
    expect(next).toBeNull();
});
