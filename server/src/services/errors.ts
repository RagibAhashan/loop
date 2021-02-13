export class BannedUserError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = BannedUserError.name;
    }
}

export class EmailAlreadySent extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = EmailAlreadySent.name;
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

export class UserCapReachedError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserCapReachedError.name;
    }
}

export class LicenseKeyNotFound extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = LicenseKeyNotFound.name;
    }
}

export class LicenseRegistrationError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = LicenseRegistrationError.name;
    }
}

export class InvalidLicenseKeyError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = InvalidLicenseKeyError.name;
    }
}

export class UserNotFoundError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserNotFoundError.name;
    }
}