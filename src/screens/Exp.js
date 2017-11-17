import React from "react";
import { connect } from "react-redux";
import { ScrollView, Keyboard, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Screen, DropDownMenu, Row, Caption, View } from "@shoutem/ui";

import SelfPosition from "../components/SelfPosition";
import MinimalInput from "../components/MinimalInput";
import SuggestionCards from "../components/SuggestionCards";
import OrderButtons from "../components/OrderButtons";
import RideStatus from "../components/RideStatus";

import {
  getSuggestedPlaces,
  selectPlaceFromSuggestions,
  findMyRide
} from "../redux/modules/main";

class Exp extends React.Component {
  _manualRequest = (service, key) => {
    const { dispatch } = this.props;
    return () => {
      dispatch(findMyRide({ service, key }));
    };
  };
  render() {
    const {
      gps: { coords, name },
      main: {
        searchBoxText,
        suggestedPlaces,
        selectedPlace,
        priceComparisons,
        rideData,
        rideStatus
      },
      dispatch,
      manualRequest
    } = this.props;
    const { latitude, longitude } = coords;
    const options = [
      { title: "hey", value: "heyv" },
      { title: "hello", value: "hellov" }
    ];
    return (
      <Screen styleName="paper">
        <ScrollView
          style={{ backgroundColor: "#eee" }}
          onPress={Keyboard.dismiss}
          onScroll={Keyboard.dismiss}
        >
          <View style={{ padding: "10% 20%" }}>
            <SelfPosition coords={coords} name={name} />
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
            <OrderButtons
              selectedPlace={selectedPlace}
              priceComparisons={priceComparisons}
              manualRequest={this._manualRequest}
            />
            {/* <DropDownMenu
            options={options}
            selectedOption={options[0]}
            titleProperty={"title"}
            valueProperty={"value"}
          /> */}
            {!rideData.notAsked &&
              !rideData.isLoading &&
              !rideData.hasError && (
                <View>
                  <Caption>
                    Your order: {rideData.data.service} -{" "}
                    {rideData.data.requestId}. Tride ID: {rideData.data.trideId}
                  </Caption>
                  <RideStatus trideId={rideData.data.trideId} />
                </View>
              )}
          </View>
        </ScrollView>
      </Screen>
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
  manualRequest: (service, key) => {
    return () => {
      dispatch(findMyRide({ service, key }));
    };
  },
  getFastest: () => {
    return () => {
      console.log("Should get fastest"); // TODO: implement fastest search
    };
  }
});

export default connect(mapStateToProps)(Exp);
