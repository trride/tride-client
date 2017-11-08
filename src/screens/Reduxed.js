import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View } from "react-native";

import { updateGPS, errorUpdateGPS } from "../redux/modules/gps";

import MinimalInput from "../components/MinimalInput";

class Reduxed extends Component {
  componentDidMount() {
    const { handleUpdateGPS, handleErrorUpdatingGPS } = this.props;
    this.watcher =
      this.watcher ||
      navigator.geolocation.watchPosition(
        handleUpdateGPS,
        handleErrorUpdatingGPS,
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
        <MinimalInput
          updateTextInputValue={text => {
            console.log(`${text} is awesome`);
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ gps }) => {
  return {
    gps
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleUpdateGPS: data => {
    dispatch(updateGPS(data));
  },
  handleErrorUpdatingGPS: () => {
    dispatch(errorUpdateGPS());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Reduxed);
