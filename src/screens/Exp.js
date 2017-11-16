import React from "react";
import { connect } from "react-redux";
import { ScrollView, Keyboard, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Screen } from "@shoutem/ui";

import SelfPosition from "../components/SelfPosition";

const MainMenuScrollView = styled(ScrollView)`background: white;`;

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
      }
    } = this.props;
    return (
      <Screen styleName="paper">
        <ScrollView>
          <SelfPosition coords={coords} name={name} />
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
