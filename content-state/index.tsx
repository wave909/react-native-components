import React, {Component, ReactElement} from "react";
import {ContentStore, isContentStore} from "../content-store";
import {ActivityIndicator, StyleSheet} from "react-native";
import {observer} from "mobx-react";
import FlatAlert from "../design/flat-alert";

const styles = StyleSheet.create({
    progress: {
        flex: 1,
    }
})

export class EmptyProps {
    constructor(readonly emptyText: string,
                readonly retry: () => void,
                readonly retryText?: string) {}
}

export class ErrorProps<ErrorType> {
    constructor(readonly errorText: (error: ErrorType) => string,
                readonly retry: (error: ErrorType) => void,
                readonly retryText?: string) {}
}

interface ContentStateProps<DataType, ErrorType> {
    isFetching?: boolean
    error?: ErrorType
    dataSource: DataType | ContentStore<DataType, ErrorType>

    showProgressWithData?: boolean
    showDataWhenError?: boolean

    isDataEmpty?: (data: DataType) => boolean

    renderData: (data: DataType) => ReactElement<any>
    renderEmpty: (() => ReactElement<any>) | EmptyProps
    renderError: ((error: ErrorType) => ReactElement<any>) | ErrorProps<ErrorType>
    renderProgress?: () => ReactElement<any>
}

@observer
export default class ContentState<DataType, ErrorType> extends Component<ContentStateProps<DataType, ErrorType>> {

    static renderProgress(): ReactElement<any> {
        return <ActivityIndicator style={styles.progress} size="large"/>
    }

    chooseProgressRenderer() {
        return this.props.renderProgress ? this.props.renderProgress() : ContentState.renderProgress()
    }

    chooseEmptyRenderer() {
        if (this.props.renderEmpty instanceof EmptyProps) {
            const emptyProps = this.props.renderEmpty

            return <FlatAlert message={emptyProps.emptyText} onRetryPress={emptyProps.retry} retry={emptyProps.retryText}/>
        } else {
            return this.props.renderEmpty()
        }
    }

    chooseErrorRenderer(error: ErrorType) {
        if (this.props.renderError instanceof ErrorProps) {
            const errorProps = this.props.renderError

            return <FlatAlert message={errorProps.errorText(error)} onRetryPress={() => errorProps.retry(error)} retry={errorProps.retryText}/>
        } else {
            return this.props.renderError(error)
        }
    }

    render() {
        const {dataSource} = this.props;

        let isFetching: boolean
        let error: ErrorType
        let data: DataType

        if (isContentStore(dataSource)) {
            isFetching = dataSource.isFetching || this.props.isFetching
            error = dataSource.error || this.props.error
            data = dataSource.data
        } else {
            isFetching = this.props.isFetching
            error = this.props.error
            data = dataSource
        }

        const isEmpty = this.props.isDataEmpty ? this.props.isDataEmpty(data) : !data || Array.isArray(data) && data.length === 0

        if (isFetching) {
            if (!isEmpty && this.props.showProgressWithData) {
                return [this.props.renderData(data), this.chooseProgressRenderer()]
            } else {
                return this.chooseProgressRenderer();
            }
        }

        if (error) {
            if (this.props.showDataWhenError && !isEmpty) {
                return this.props.renderData(data)
            } else {
                return this.chooseErrorRenderer(error)
            }
        }

        if (isEmpty) {
            return this.chooseEmptyRenderer()
        }

        return this.props.renderData(data)
    }
}