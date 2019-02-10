import React, {Component} from "react"
import {inject, observer} from "mobx-react"
// @ts-ignore
import {getNavigation, NavigationScreenProp, NavigationState} from "react-navigation"
import {StatefullNavigationStore} from "./navigation-store"

interface StatefulNavigatorProps {
    navigationStore?: StatefullNavigationStore
}

@inject("navigationStore")
@observer
export class StatefulNavigator extends Component<StatefulNavigatorProps, {}> {
    currentNavProp: NavigationScreenProp<NavigationState>

    getCurrentNavigation = () => {
        return this.currentNavProp
    }

    render() {
        const {state, dispatch, actionSubscribers} = this.props.navigationStore

        const Navigator = this.props.navigationStore.getNavigator()

        this.currentNavProp = getNavigation(
            Navigator.router,
            state,
            dispatch,
            actionSubscribers(),
            {},
            this.getCurrentNavigation,
        )


        return <Navigator navigation={this.currentNavProp}/>
    }
}
