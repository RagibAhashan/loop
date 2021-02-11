export class BannedUserError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = BannedUserError.name;
    }
}

export class UserAlreadyExistError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserAlreadyExistError.name;
    }
}

export class UserAlreadyExistManyTimes extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserAlreadyExistManyTimes.name;
    }
}