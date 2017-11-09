import React from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-elements";
import styled from "styled-components/native";

const SuggestionCards = props => (
  <View style={props.style}>
    {props.suggestedPlaces.map((place, index) => (
      <View key={index}>
        <Card title={place.name}>
          <Text>{place.address}</Text>
        </Card>
      </View>
    ))}
  </View>
);

export default styled(SuggestionCards)`

`;
