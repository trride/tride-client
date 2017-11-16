import React, { Component } from "react";
import { View } from "react-native";
import { Card } from "react-native-elements";
import { Text } from "@shoutem/ui";
import styled from "styled-components/native";

const BoxShadow = styled.View`
  border: solid #000;
  shadow-radius: 500;
  shadow-color: #aaa;
`;
const SelfPosition = ({ style, coords, name }) => (
  <BoxShadow>
    {name.notAsked && !name.hasError ? (
      <Text>
        {coords.latitude}, {coords.longitude} woot
      </Text>
    ) : (
      <Text>{name.data} woot</Text>
    )}
  </BoxShadow>
);

export default SelfPosition;
