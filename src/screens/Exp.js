import React from "react";
import { connect } from "react-redux";
import {
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  View
} from "react-native";
import styled from "styled-components/native";

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
      <MainMenuScrollView>
        <SelfPosition coords={coords} name={name} />
      </MainMenuScrollView>
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
