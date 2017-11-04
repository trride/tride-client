import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Card } from "react-native-elements";

import { debouncedFindPOI, findPOI } from "../util/tride";

class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      long: 0,
      lastUpdated: Date.now(),
      timesUpdated: 0,
      error: "",
      prices: {},
      searchTerm: "",
      searchResult: [],
      estimates: []
    };

    this.updateCoords = this.updateCoords.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleSelectSuggestion = this.handleSelectSuggestion.bind(this);
  }

  componentDidMount() {
    this.watcher =
      this.watcher ||
      navigator.geolocation.watchPosition(
        this.updateCoords,
        error => this.setState({ error: error.message }),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10
        }
      );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watcher);
  }

  updateCoords({ coords, timestamp }) {
    console.log(coords);
    return this.setState(prevState => {
      return {
        lat: coords.latitude,
        long: coords.longitude,
        lastUpdated: timestamp,
        timesUpdated: prevState.timesUpdated + 1
      };
    });
  }

  async handleChangeText(searchTerm) {
    const { lat, long } = this.state;
    this.setState({
      searchTerm
    });
    console.log("search term is", searchTerm);
    const { points, error } = await debouncedFindPOI(lat, long, searchTerm);
    this.setState({
      searchResult: error ? [] : points
    });
  }

  handleSelectSuggestion(place) {
    const { lat, long } = this.state;
    return async () => {
      this.setState({
        searchTerm: place.name,
        searchResult: []
      });
      const { coords } = await fetch(
        `https://tride-api.now.sh/coords?placeid=${place.placeid}`
      )
        .then(res => res.json())
        .catch(err => {
          console.error(err);
          return {};
        });
      const { estimates } = await fetch(
        `https://tride-api.now.sh/estimate?start_lat=${lat}&start_long=${long}&end_lat=${coords.latitude}&end_long=${coords.longitude}`
      )
        .then(res => res.json())
        .catch(err => {
          console.error(err);
          return {};
        });
      this.setState({ estimates });
    };
  }

  render () {
    const {
      lat,
      long,
      timesUpdated,
      searchTerm,
      searchResult,
      estimates
    } = this.state;
    return(
      <View style={styles.container}>
        <Text>Saya mau ke</Text>
        <View
         style={{
           flexDirection: "row"
         }}
        >
         <TextInput
           style={{
             flex: 1,
             alignItems: "center",
             alignContent: "center",
             justifyContent: "center"
           }}
           placeholder="..."
           onChangeText={this.handleChangeText}
           value={searchTerm}
         />
        </View>
        {searchResult.length > 0 &&
         searchResult.map(r => (
           <TouchableOpacity
             key={r.placeid}
             onPress={this.handleSelectSuggestion(r)}
           >
             <Text>
               {r.name} - {r.address}
             </Text>
           </TouchableOpacity>
         ))}

        {estimates.length > 0 && estimates.map(e => (
           <Text>
             {e.service}: {e.price} {e.cheapest && `(CHEAPEST!)`}
           </Text>
         ))}
        <Text>Current Lat: {lat}</Text>
        <Text>Current Long: {long}</Text>
        <Text>Times Updated: {timesUpdated}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default MainMenu;
