import React from "react";
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'

import store from './stores'

import MainMenu from './screens/MainMenu'

const AppNavigator = StackNavigator({
  MainMenuScreen: { screen: MainMenu }
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
}
