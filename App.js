import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from "react-native";
import emails from './mail';
import { Card } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class App extends React.Component {
  state = {
    lat: 0,
    long: 0,
    lastUpdated: Date.now(),
    timesUpdated: 0,
    error: "",
    prices: {},
    searchTerm: ''
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
    console.log('this is the state after press updatecoords', this.state)
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

  searchUpdated(term) {
   this.setState({ searchTerm: term })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container3}>
          <Text style={{textAlign: 'center', fontSize: 30}}>
           Saya mau pergi ke
          </Text>
            <TextInput
              onChangeText={(term) => { this.searchUpdated(term) }}
              style={styles.searchInput}
              placeholder="Type here..."
              />
        </View>

        <View style={{flex: 0.3}}>
        <TouchableHighlight underlayColor='white' onPress={() => this.updateCoords()}>
           <View style={styles.container2}>
              <Icon name="map-pin" size={15} color="black"/>
              <Text> Masukan lokasi akuratnya </Text>
           </View>
        </TouchableHighlight>
        </View>

        <View style={{flex: 0.3}}>
        <TouchableHighlight underlayColor='white'>
           <View style={styles.container1}>
              <Icon name="clock-o" size={15} color="black"/>
              <Text> Dari sejarah </Text>
           </View>
        </TouchableHighlight>

        <Text>
         Lat: {this.state.lat}, Long: {this.state.long}
         </Text>
         <Text>
         Last updated: {this.state.lastUpdated}, Times Updated:{" "}
         {this.state.timesUpdated}
         </Text>
         
        </View>
      </View>
    );
  }
}


// <Card>
//   <Text>
//     Lat: {this.state.lat}, Long: {this.state.long}
//   </Text>
//   <Text>
//     Last updated: {this.state.lastUpdated}, Times Updated:{" "}
//     {this.state.timesUpdated}
//   </Text>
//   {this.state.error ? (
//     <Text>{this.state.error}</Text>
//   ) : (
//     <Text>All good</Text>
//   )}
// </Card>
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  container1: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  container3: {
    flex: 0.3,
    justifyContent: 'center'
    // alignItems: 'center'
  },
  container2: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  searchInput:{
    padding: 10,
    marginLeft: 32
  }
});

// flex: 1,
// backgroundColor: "#fff",
// alignItems: "center",
// justifyContent: "center"
