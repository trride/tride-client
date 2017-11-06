import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View } from "react-native";

import { updatePosition, gpsErrorHandler } from "../redux/modules/gps";

class Reduxed extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    this.watcher =
      this.watcher ||
      navigator.geolocation.watchPosition(
        data => {
          dispatch(updatePosition(data));
        },
        () => {
          dispatch(gpsErrorHandler());
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10
        }
      );
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watcher);
  }
  render() {
    const { gps: { coords: { latitude, longitude } } } = this.props;
    return (
      <View>
        <Text>
          latitude = {latitude}, longitude = {longitude}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({ gps }) => {
  return {
    gps
  };
};

export default connect(mapStateToProps)(Reduxed);
