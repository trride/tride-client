import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, ScrollView } from "react-native";

import { updateGPS, errorUpdateGPS } from "../redux/modules/gps";
import {
  getSuggestedPlaces,
  selectPlaceFromSuggestions
} from "../redux/modules/main";

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
  componentDidCatch(err) {
    console.log(err);
    return <Text>error bro</Text>;
  }
  render() {
    const {
      gps: { coords: { latitude, longitude } },
      main: { searchBoxText, suggestedPlaces },
      dispatch
    } = this.props;
    console.log(this.props);
    return (
      <ScrollView>
        <Text>
          latitude = {latitude}, longitude = {longitude}
        </Text>
        <MinimalInput
          value={searchBoxText}
          handleChangeText={text => {
            dispatch(getSuggestedPlaces(latitude, longitude, text));
          }}
        />
        <SuggestionCards
          suggestedPlaces={suggestedPlaces}
          onCardTap={placeid => {
            return () => {
              dispatch(selectPlaceFromSuggestions(placeid));
            };
          }}
        />
      </ScrollView>
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
