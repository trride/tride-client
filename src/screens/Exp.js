import React from "react";
import { connect } from "react-redux";
import {
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  View
} from "react-native";

class Exp extends React.Component {
  render() {
    const { gps: { coords: { latitude, longitude }, name } } = this.props;
    return (
      <ScrollView>
        <Text>Scrolling View</Text>
        <Text>
          Self position:{" "}
          {name.notAsked
            ? `latitude = ${latitude}, longitude = ${longitude}`
            : name.data}
        </Text>
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

export default connect(mapStateToProps)(Exp);
