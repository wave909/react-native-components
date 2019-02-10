import {action, computed, observable, reaction, runInAction} from "mobx";

export class FormField<DataType, ErrorType> {
    @observable error?: ErrorType;
    @observable data?: DataType;

    @computed get isValid(): boolean {
        return !this.error;
    }

    constructor(private readonly formFieldOptions: FormFieldOptions<DataType, ErrorType>) {
        this.data = formFieldOptions.initData;
    }

    @action
    setData(data: DataType) {
        this.data = data
    }

    @action
    setError(error: ErrorType) {
        this.error = error
        if (this.error) {
            reaction(() => this.data,
                (newData, reaction) => {
                    runInAction(() => {
                        this.error = undefined;
                    });
                    reaction.dispose();
                });
        }
    }

    @action
    validate(): boolean {
        this.setError(this.formFieldOptions.validate(this.data))
        return this.isValid;
    }
}

export interface FormFieldOptions<DataType, ErrorType> {
    validate(data: DataType): ErrorType
    initData?: DataType
}

export function validate(...formFields: FormField<any, any>[]): boolean {
    let isValid = true;
    formFields.forEach(field => {
        const validate = field.validate();
        if (isValid && !validate) {
            isValid = false;
        }
    });
    return isValid;
}