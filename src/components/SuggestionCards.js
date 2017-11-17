import React from "react";
import {
  Card,
  ListView,
  Text,
  TouchableOpacity,
  View,
  Row,
  Caption,
  Spinner
} from "@shoutem/ui";
import styled from "styled-components/native";

const SuggestionCards = ({
  style,
  suggestedPlaces: { notAsked, isLoading, hasError, data },
  onCardTap
}) => {
  if (!!notAsked) {
    return null;
  } else if (isLoading) {
    return (
      <Row>
        <Spinner />
        <Text style={{ marginLeft: 24 }}>
          {"Searching for matching destinations."}
        </Text>
      </Row>
    );
  } else if (!!hasError) {
    return (
      <Row>
        <Text>{"We're experiencing network issues while searching."}</Text>
      </Row>
    );
  } else if (data.length < 1) {
    return (
      <Row>
        <Text>{"We can't find matching destination."}</Text>
      </Row>
    );
  } else {
    return (
      <ListView
        data={data}
        renderRow={place => (
          <Row>
            <TouchableOpacity onPress={onCardTap(place)}>
              <Text>{place.name}</Text>
              <Caption>{place.address}</Caption>
            </TouchableOpacity>
          </Row>
        )}
      />
    );
  }
};

export default styled(SuggestionCards)`

`;
