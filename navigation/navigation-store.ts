import {
    IModelType,
    Instance,
    IType, ModelActions,
    ModelPropertiesDeclaration,
    ModelPropertiesDeclarationToProperties,
    types
} from "mobx-state-tree"
import {
    NavigationAction,
    NavigationActions,
    NavigationContainer,
    NavigationParams,
    NavigationState as ReactNavigationState
} from "react-navigation"
import {NavigationEvents} from "./navigation-events"
import {NavigationState} from "./navigation-state";


let navigator: NavigationContainer
let defaultState: ReactNavigationState

interface IStatefulNavigationStore extends INavigationStore {
    findCurrentRoute()

    getNavigator(): NavigationContainer

    actionSubscribers()

    dispatch(action: NavigationAction, navigationState?: NavigationState)
}

interface StatefulNavigationModelProperties extends ModelPropertiesDeclaration {
    state: IType<ReactNavigationState, ReactNavigationState, ReactNavigationState>,
}

type StatefullNavigationModelType = IModelType<ModelPropertiesDeclarationToProperties<StatefulNavigationModelProperties>, IStatefulNavigationStore>

interface INavigationStore extends ModelActions {
    reset()

    navigateTo(routeName: string, params?: NavigationParams, navigationState?: NavigationState)

    navigateBack()
}

type NavigationModelType = IModelType<ModelPropertiesDeclarationToProperties<ModelPropertiesDeclaration>, INavigationStore>

/**
 * Finds the current route.
 *
 * @param navState the current nav state
 */
function findCurrentRoute(navState) {
    const route = navState.routes[navState.index]
    if (route.routes) {
        return findCurrentRoute(route)
    }
    return route
}

/**
 * Tracks the navigation state for `react-navigation` as well as providers
 * the actions for changing that state.
 */
const NavigationStoreModel = NavigationEvents.named("NavigationStore")
    .props({
        /**
         * the navigation state tree (Frozen here means it is immutable.)
         */
        state: types.frozen<ReactNavigationState>(),
    })
    .actions(self => ({

        afterCreate() {
            if (!self.state) {
                self.state = defaultState
            }
        },

        getNavigator() {
            return navigator
        },

        /**
         * Return all subscribers
         */
        actionSubscribers() {
            return self.subs
        },

        /**
         * Fires when navigation happens.
         *
         * Our job is to update the state for this new navigation action.
         *
         * @param action The new navigation action to perform
         * @param navigationState set nav state DEFAULT
         */
        dispatch(action: NavigationAction, navigationState: NavigationState = NavigationState.LAST) {
            let previousNavState
            switch (navigationState) {
                case NavigationState.LAST: {
                    previousNavState = self.state;
                    break
                }
                case NavigationState.DEFAULT: {
                    previousNavState = defaultState
                    break
                }
                case NavigationState.NONE: {
                    previousNavState = null;
                    break
                }
            }
            self.state = navigator.router.getStateForAction(action, previousNavState) || self.state
            self.fireSubscribers(action, previousNavState, self.state)
            return true
        },

        /**
         * Resets the navigation back to the start.
         */
        reset() {
            self.state = defaultState
        },

        /**
         * Finds the current route.
         */
        findCurrentRoute() {
            return findCurrentRoute(self.state)
        },

        /**
         * Navigate to another place.
         *
         * @param routeName The route name.
         * @param params Additional parameters.
         * @param navigationState set nav state DEFAULT
         */
        navigateTo(routeName: string, params?: NavigationParams, navigationState: NavigationState = NavigationState.LAST) {
            this.dispatch(NavigationActions.navigate({routeName, params}), navigationState)
        },

        navigateBack() {
            this.dispatch(NavigationActions.back())
        }
    } as IStatefulNavigationStore))

export function getNavigationStoreModel(newNavigator: NavigationContainer, newDefaultState: ReactNavigationState) {
    navigator = newNavigator
    defaultState = newDefaultState
    return types.optional(NavigationStoreModel, {} as any)
}

export type NavigationStore = Instance<NavigationModelType>

export type StatefullNavigationStore = Instance<StatefullNavigationModelType>
