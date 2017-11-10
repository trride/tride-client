import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import styled from "styled-components/native";

const SuggestionCards = ({
  style,
  suggestedPlaces: { notAsked, isLoading, hasError, data },
  onCardTap
}) => {
  if (!!notAsked) {
    return <View />;
  } else if (isLoading) {
    return <Card title={"Loading"} />;
  } else if (!!hasError) {
    return (
      <Card title={"Error"}>
        <Text>{"Error searching for destination"}</Text>
      </Card>
    );
  } else if (data.length < 1) {
    return (
      <View style={style}>
        <Card title={"No results"}>
          <Text>{"No destination found"}</Text>
        </Card>
      </View>
    );
  } else {
    return (
      <View style={style}>
        {data.map((place, index) => (
          <TouchableOpacity key={index} onPress={onCardTap(place)}>
            <Card title={place.name}>
              <Text>{place.address}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};

export default styled(SuggestionCards)`

`;
