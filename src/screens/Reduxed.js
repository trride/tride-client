import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View } from "react-native";

import { updateGPS, errorUpdateGPS } from "../redux/modules/gps";
import { getSuggestedPlaces } from "../redux/modules/main";

import MinimalInput from "../components/MinimalInput";
import SuggestionCards from "../components/SuggestionCards";

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
    console.log(this.props);
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watcher);
  }
  render() {
    const {
      gps: { coords: { latitude, longitude } },
      main: { searchBoxText, suggestedPlaces },
      dispatch
    } = this.props;
    return (
      <View>
        <Text>
          latitude = {latitude}, longitude = {longitude}
        </Text>
        <MinimalInput
          value={searchBoxText}
          handleChangeText={text => {
            dispatch(getSuggestedPlaces(latitude, longitude, text));
          }}
        />
        <SuggestionCards suggestedPlaces={suggestedPlaces} />
      </View>
    );
  }
}

const mapStateToProps = ({ gps, main }) => {
  return {
    gps,
    main
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
