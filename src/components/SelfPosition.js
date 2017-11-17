import React, { Component } from "react";
// import {  } from "react-native";
import { View, Caption } from "@shoutem/ui";
import styled from "styled-components/native";

const SelfPosition = ({ style, coords, name }) => (
  <View style={{ backgroundColor: "#eee", marginTop: "20%" }}>
    <Caption>
      Lokasi saya:{" "}
      {name.notAsked && !name.hasError
        ? `${coords.latitude}, ${coords.longitude}`
        : name.data}
    </Caption>
  </View>
);

export default SelfPosition;
