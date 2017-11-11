import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  View
} from "react-native";
import styled from "styled-components/native";

import { reverseGeo } from "../util/tride";
import { handleUpdateGPS, errorUpdateGPS } from "../redux/modules/gps";
import {
  getSuggestedPlaces,
  selectPlaceFromSuggestions,
  findMyRide
} from "../redux/modules/main";

import MinimalInput from "../components/MinimalInput";
import SuggestionCards from "../components/SuggestionCards";

class Reduxed extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const onChangeGPS = text => dispatch(handleUpdateGPS(text));
    const onErrorGPS = () => dispatch(errorUpdateGPS());
    this.watcher =
      this.watcher ||
      navigator.geolocation.watchPosition(onChangeGPS, onErrorGPS, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      });
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
      gps: { coords: { latitude, longitude }, name },
      main: { searchBoxText, suggestedPlaces, selectedPlace, priceComparisons },
      dispatch,
      style
    } = this.props;
    console.log(this.props);
    return (
      <ScrollView
        onPress={Keyboard.dismiss}
        onScroll={Keyboard.dismiss}
        style={style}
      >
        <Text>
          Self position:{" "}
          {name.notAsked
            ? `latitude = ${latitude}, longitude = ${longitude}`
            : name.data}
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
        {/* <OrderButtons
          selectedPlace={selectedPlace}
          priceComparisons={priceComparisons}
        /> */}
        <Text>
          {selectedPlace.notAsked
            ? ""
            : "destination: " +
              (selectedPlace.isLoading
                ? "Loading coordinates of selected place"
                : selectedPlace.hasError
                  ? "Coordinates of destination can't be fetched"
                  : selectedPlace.data.address)}
        </Text>
        <View>
          {priceComparisons.notAsked ? (
            <View />
          ) : priceComparisons.isLoading ? (
            <Text>Loading prices</Text>
          ) : priceComparisons.hasError ? (
            <Text>Error fetching prices. Retry?</Text>
          ) : (
            priceComparisons.data.map((e, i) => (
              <View key={i}>
                <Text>
                  {e.service}: {e.price} {e.cheapest && `(CHEAPEST!)`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      findMyRide({
                        service: e.service,
                        key: e.requestKey.key
                      })
                    );
                  }}
                >
                  <Text>Order</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <View>
          {!!rideId.data &&
            !rideStatus.notAsked && (
              <View>
                <Text>ride id {rideId.data}</Text>
              </View>
            )}
        </View>
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

const StyledApp = styled(Reduxed)`background: white;`;

export default connect(mapStateToProps)(StyledApp);
