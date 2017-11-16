import React from "react";
import { StackNavigator } from "react-navigation";
import { Provider, connect } from "react-redux";
import { Font } from "expo";

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
        enableHighAccuracy: false,
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
class WithFonts extends React.Component {
  state = { ready: false };
  async componentWillMount() {
    await Font.loadAsync({
      "Rubik-Black": require("../node_modules/@shoutem/ui/fonts/Rubik-Black.ttf"),
      "Rubik-BlackItalic": require("../node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf"),
      "Rubik-Bold": require("../node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf"),
      "Rubik-BoldItalic": require("../node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf"),
      "Rubik-Italic": require("../node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf"),
      "Rubik-Light": require("../node_modules/@shoutem/ui/fonts/Rubik-Light.ttf"),
      "Rubik-LightItalic": require("../node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf"),
      "Rubik-Medium": require("../node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf"),
      "Rubik-MediumItalic": require("../node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf"),
      "Rubik-Regular": require("../node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf"),
      "rubicon-icon-font": require("../node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf")
    });
    this.setState({ ready: true });
  }

  render() {
    return this.state.ready && this.props.render();
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <WithGPS render={() => <WithFonts render={() => <AppNavigator />} />} />
      </Provider>
    );
  }
}
