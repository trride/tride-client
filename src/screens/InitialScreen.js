import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native"

import TRIDELOGO from '../assets/pictures/tride-logo.png'

const InitialScreen = (props) => {
  const { navigate } = props.navigation
  const { container } = style
  return (
    <View style={ container }>
      <Image
        style={{ width: 170, height: 170 }}
        source={ TRIDELOGO }
      />
      <Text onPress={ setTimeout(function(){ navigate('MainMenuScreen') }, 2000) }></Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default InitialScreen
