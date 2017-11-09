import React, { Component } from "react";
import { TextInput } from "react-native";
import styled from "styled-components/native";

class MinimalInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { style, value, handleChangeText, placeholder } = this.props;
    return (
      <TextInput
        style={style}
        placeholder={placeholder || "..."}
        value={value || ""}
        onChangeText={handleChangeText}
      />
    );
  }
}

export default styled(MinimalInput)`
  color: black;
  width: 100%;
`;
