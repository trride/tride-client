import React, { Component } from "react";
import { View } from "react-native";
import { TextInput, Title, Row, Card } from "@shoutem/ui";
import styled from "styled-components/native";

export default class MinimalInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { style, value, handleChangeText, placeholder } = this.props;
    return (
      <View>
        <Title
          style={{ marginBottom: "10%", marginTop: "10%" }}
          // styleName={"bold"}
        >
          Carikan saya motor menuju{" "}
        </Title>
        <TextInput
          placeholder={placeholder || ""}
          value={value || ""}
          onChangeText={handleChangeText}
        />
      </View>
    );
  }
}
