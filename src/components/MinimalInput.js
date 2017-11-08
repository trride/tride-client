import React, { Component } from "react";
import { TextInput } from "react-native";
import styled from "styled-components/native";

class MinimalInput extends Component {
  state = {
    value: ""
  };

  constructor(props) {
    super(props);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  handleChangeText(text) {
    const { updateTextInputValue } = this.props;
    this.setState(
      {
        value: text
      },
      () => {
        updateTextInputValue(text);
      }
    );
  }

  render() {
    const { value } = this.state;
    const { style } = this.props;
    return (
      <TextInput
        style={style}
        placeholder={"..."}
        value={value}
        onChangeText={this.handleChangeText}
      />
    );
  }
}

export default styled(MinimalInput)`
  color: black;
  width: 100%;
`;
