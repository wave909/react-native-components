import {FormFieldOptions} from "./form-field";
import {isStringEmpty} from "../utils/string-utils";


export class StringEmptyOptions<ErrorType> implements FormFieldOptions<string, ErrorType> {

    constructor(private readonly emptyError: ErrorType, readonly initData?: string) {}

    validate(data: string): ErrorType {
        return isStringEmpty(data) ?  this.emptyError: null;
    }
}