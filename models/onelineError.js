let errMessage;
let httpCode;

class apiError extends Error {

    constructor(errCode, msg) {
        super();
        this.name = "OneLineError";
        // this.errCode
    }

}
