import {
    IModelType, Instance,
    IType,
    ModelPropertiesDeclaration,
    ModelPropertiesDeclarationToProperties,
    types
} from "mobx-state-tree";
import {action, mst, shim} from "classy-mst";

interface IContentStore<DataType, ErrorType> {
    setLoading()
    setError(error: ErrorType)
    setData(data: DataType)
}

interface ContentModelProperties<DataType, ErrorType> extends ModelPropertiesDeclaration {
    isFetching: boolean,
    error: IType<ErrorType, ErrorType, ErrorType>,
    data: IType<DataType, DataType, DataType>
}

type ContentModelType<DataType, ErrorType> = IModelType<ModelPropertiesDeclarationToProperties<ContentModelProperties<DataType, ErrorType>>, IContentStore<DataType, ErrorType>>

const ContentData = types.model({
    isFetching: false,
    error: types.frozen(),
    data: types.frozen()
})

class ContentActions<DataType, ErrorType> extends shim(ContentData) implements IContentStore<DataType, ErrorType> {

    @action
    setLoading() {
        this.isFetching = true
        this.error = null
    }

    @action
    setError(error: ErrorType) {
        this.isFetching = false
        this.error = error
    }

    @action
    setData(data: DataType) {
        this.isFetching = false
        this.data = data
    }
}
const ContentStoreModel = mst(ContentActions, ContentData, 'ContentStore');

export type ContentStore<DataType, ErrorType> = Instance<ContentModelType<DataType, ErrorType>>

export function contentStoreModel<DataType, ErrorType>() {
    return ContentStoreModel as ContentModelType<DataType, ErrorType>
}

export function createContentStore<DataType, ErrorType>(initValue?: DataType) {
    return contentStoreModel<DataType, ErrorType>().create({data: initValue} as any)
}

export function isContentStore<DataType, ErrorType>(data: any): data is ContentStore<DataType, ErrorType> {
    return data.hasOwnProperty('isFetching') &&
        data.hasOwnProperty('data') &&
        data.hasOwnProperty('error') &&
        (<ContentStore<DataType, ErrorType>>data).setLoading !== undefined &&
        (<ContentStore<DataType, ErrorType>>data).setData !== undefined &&
        (<ContentStore<DataType, ErrorType>>data).setError !== undefined
}