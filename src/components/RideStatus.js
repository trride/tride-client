import React, { Component } from "react";
import { View } from "react-native";
import { TextInput, Title, Row, Card } from "@shoutem/ui";
import styled from "styled-components/native";

import database from "../util/db";

export default class RideStatus extends Component {
  state = {
    rideStatus: {}
  };
  async componentDidMount() {
    const { trideId } = this.props;
    console.log("rideStatus mounted");
    this.ref = await database.ref(`rides/${trideId}`);
    console.log(this.ref);
    this.ref.on("value", async snapshot => {
      const val = await snapshot.val();
      console.log(val);
      this.setState({ rideStatus: val });
    });
  }

  render() {
    const { rideStatus } = this.state;
    return (
      <View>
        <Title style={{ marginBottom: "10%", marginTop: "10%" }}>
          ORDER STATUS: {rideStatus.status || null}
        </Title>
      </View>
    );
  }
}
