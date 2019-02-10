import {IReactionDisposer, reaction} from "mobx";
import {showLongToast} from "./toast-utils";

export class ConnectionError implements Error {
    name = "ConnectionError";

    constructor(readonly message: string,
                readonly status: number,
                readonly local: boolean,
                readonly unauthorized: boolean,
                readonly src?: any,) {}
}

export function formError(err: any, message: string): ConnectionError {
    return new ConnectionError(message,
        err ? err["status"] as number : 0,
        !(err && err["status"]),
        err && err["status"] === 401,
        err)
}

export function showLongToastOnError(expression: () => Error | ConnectionError | string): IReactionDisposer {
    return reaction(expression,
        (error) => {
            if (error && (!(error instanceof ConnectionError) || !error.unauthorized)) {
                showLongToast(typeof error === "string"  ? error : error.message);
            }
        })
}

export const getErrorMessage = (error: Error) => {
    return error.message
}