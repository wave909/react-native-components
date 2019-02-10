import React, {Component} from 'react'
import {Button, ButtonProps, Headline} from "react-native-paper";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
    },
})

interface FlatAlertProps {
    message: string
    messageStyle?: StyleProp<ViewStyle>

    retry?: string
    onRetryPress: () => void
    retryStyle?: ButtonProps
}

export default class FlatAlert extends Component<FlatAlertProps> {

    render(): React.ReactNode {
        return <View style={styles.centerContent}>
            <Headline
                style={[styles.message, this.props.messageStyle]}>{this.props.message}</Headline>
            <Button
                mode={'contained'}
                onPress={this.props.onRetryPress}
                {...this.props.retryStyle}>
                {this.props.retry || "Повторить"}
            </Button>
        </View>
    }
}

export const renderEmptyView = (emptyText: string, onPress: () => void, retry?: string, messageStyle?: StyleProp<ViewStyle>, retryStyle?: ButtonProps) => () => {
    return <FlatAlert message={emptyText} onRetryPress={onPress} retry={retry} messageStyle={messageStyle} retryStyle={retryStyle}/>
}

export const renderErrorView = (onPress: () => void, retry?: string, messageStyle?: StyleProp<ViewStyle>, retryStyle?: ButtonProps) => (error: Error) => {
    return <FlatAlert message={error.message} onRetryPress={onPress} retry={retry} messageStyle={messageStyle} retryStyle={retryStyle}/>
}