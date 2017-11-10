import React from "react";
import { StackNavigator } from "react-navigation";
import { Provider } from "react-redux";

import store from "./redux";

import MainMenu from "./screens/MainMenu";
import Reduxed from "./screens/Reduxed";
import InitialScreen from "./screens/InitialScreen"

const AppNavigator = StackNavigator({
  InitialScreen: { screen: InitialScreen },
  MainMenuScreen: { screen: Reduxed },
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
