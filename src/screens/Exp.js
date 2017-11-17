import React from "react";
import { connect } from "react-redux";
import { ScrollView, Keyboard, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Screen, DropDownMenu } from "@shoutem/ui";

import SelfPosition from "../components/SelfPosition";
import MinimalInput from "../components/MinimalInput";
import SuggestionCards from "../components/SuggestionCards";
import OrderButtons from "../components/OrderButtons";

import {
  getSuggestedPlaces,
  selectPlaceFromSuggestions,
  findMyRide
} from "../redux/modules/main";

class Exp extends React.Component {
  render() {
    const {
      gps: { coords, name },
      main: {
        searchBoxText,
        suggestedPlaces,
        selectedPlace,
        priceComparisons,
        rideId,
        rideStatus
      },
      dispatch
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
            />
            {/* <DropDownMenu
            options={options}
            selectedOption={options[0]}
            titleProperty={"title"}
            valueProperty={"value"}
          /> */}
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

export default connect(mapStateToProps)(Exp);
