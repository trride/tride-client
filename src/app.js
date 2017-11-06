import React from "react";
import { StackNavigator } from "react-navigation";
import { Provider } from "react-redux";

import store from "./redux";

import MainMenu from "./screens/MainMenu";
import Reduxed from "./screens/Reduxed";

const AppNavigator = StackNavigator({
  // MainMenuScreen: { screen: MainMenu }
  MainMenuScreen: { screen: Reduxed }
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
