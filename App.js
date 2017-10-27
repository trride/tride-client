import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class App extends React.Component {
  state = {
    lat: 0,
    long: 0,
    lastUpdated: Date.now(),
    timesUpdated: 0,
    error: "",
    prices: {}
  };
  constructor(props) {
    super(props);
    this.updateCoords = this.updateCoords.bind(this);
    this.fetchPriceToMonas = this.fetchPriceToMonas.bind(this);
  }

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(this.updateCoords);
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
    // console.log(this.watcher);
    // console.log("wow");
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
    }, this.fetchPriceToMonas);
  }

  async fetchPriceToMonas() {
    const { lat, long } = this.state;
    const res = await fetch(
      `https://tride-api.now.sh/?start_lat=${lat}&start_long=${long}&end_lat=${-6.175392}&end_long=${106.827153}`
    );
    const json = await res.json();
    this.setState({
      prices: json
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Lat: {this.state.lat}, Long: {this.state.long}
        </Text>
        <Text>
          Last updated: {this.state.lastUpdated}, Times Updated:{" "}
          {this.state.timesUpdated}
        </Text>
        {this.state.error ? (
          <Text>{this.state.error}</Text>
        ) : (
          <Text>All good</Text>
        )}
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
