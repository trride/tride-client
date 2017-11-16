import React from "react";
import { StackNavigator } from "react-navigation";
import { Provider, connect } from "react-redux";

import store from "./redux";

import MainMenu from "./screens/MainMenu";
import Reduxed from "./screens/Reduxed";
import Exp from "./screens/Exp";

import { handleUpdateGPS, errorUpdateGPS } from "./redux/modules/gps";

const AppNavigator = StackNavigator({
  MainMenuScreen: { screen: Exp }
});

class GPS extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const onChangeGPS = pos => dispatch(handleUpdateGPS(pos));
    const onErrorGPS = () => dispatch(errorUpdateGPS());
    this.watcher =
      this.watcher ||
      navigator.geolocation.watchPosition(onChangeGPS, onErrorGPS, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watcher);
  }

  render() {
    return this.props.render();
  }
}

const WithGPS = connect()(GPS);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <WithGPS render={() => <AppNavigator />} />
      </Provider>
    );
  }
}
