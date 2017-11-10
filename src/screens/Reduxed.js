import React, { Component } from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, Text, ScrollView, Keyboard, Button, Image } from "react-native";
import styled from "styled-components/native";
import { Card } from "react-native-elements";

import { reverseGeo } from "../util/tride";
import { handleUpdateGPS, errorUpdateGPS } from "../redux/modules/gps";
import {
  getSuggestedPlaces,
  selectPlaceFromSuggestions
} from "../redux/modules/main";

import MinimalInput from "../components/MinimalInput";
import SuggestionCards from "../components/SuggestionCards";
import { Spinner } from '../components/Spinner';

class Reduxed extends Component {
  static navigationOptions = {
		header: null,
	}

  componentDidMount() {
    const { dispatch } = this.props;
    const onChangeGPS = text => dispatch(handleUpdateGPS(text));
    const onErrorGPS = () => dispatch(errorUpdateGPS());
    this.watcher =
      this.watcher ||
      navigator.geolocation.watchPosition(onChangeGPS, onErrorGPS, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      });
    console.log(this.props);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watcher);
  }

  componentDidCatch(err) {
    console.log(err);
    return <Text>error bro</Text>;
  }

  render() {
    const {
      gps: { coords: { latitude, longitude }, name },
      main: { searchBoxText, suggestedPlaces, selectedPlace, priceComparisons },
      dispatch,
      style
    } = this.props;
    console.log(this.props);
    const { mainTextStyle, myPositionStyle, myPositionTextStyle, poiIndicatorStyle } = Style;

    return (
      <ScrollView
        onPress={Keyboard.dismiss}
        onScroll={Keyboard.dismiss}
        style={style}
      >

        <View style={myPositionStyle}>
          <TouchableOpacity style={[
            poiIndicatorStyle,
            { backgroundColor: name.notAsked ? '#f1c40f' : '#27ae60' }
          ]}/>
          <Text style={myPositionTextStyle}>
            My position:
          </Text>
          <Text style={[
            myPositionTextStyle,
            { fontWeight: 'normal',  fontSize: 13}
          ]}>
            {" "}
            {name.notAsked
              ? `latitude = ${latitude}, longitude = ${longitude}`
              : name.data}
          </Text>
        </View>
        <Text style={mainTextStyle}>
          I am going to..
        </Text>
        <MinimalInput
          value={searchBoxText}
          handleChangeText={text => {
            dispatch(getSuggestedPlaces(latitude, longitude, text));
          }}
        />
        <SuggestionCards
          suggestedPlaces={suggestedPlaces}
          onCardTap={placeid => {
            return () => {
              dispatch(selectPlaceFromSuggestions(placeid));
            };
          }}
        />
        <View>
          {selectedPlace.notAsked
            ? <Text></Text>
            : <Card title="destination: ">
                <Text>
                  {selectedPlace.isLoading
                    ? "Loading coordinates of selected place"
                    : selectedPlace.hasError
                      ? "Coordinates of destination can't be fetched"
                      : selectedPlace.data.address
                  }
                </Text>
              </Card>
          }
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10 }}>
          {priceComparisons.notAsked
            ? <Text></Text>
            : priceComparisons.isLoading
              ? <View>
                  <Spinner
                    size="large"
                    feedback="Loading prices..."
                    textColor='#000'
                  />
                </View>
              : priceComparisons.hasError
                ? <Text>error fetching prices, Retry?</Text>
                : priceComparisons.data.map((e, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 175,
                        width: 100,
                        marginLeft: 5,
                        marginRight: 5,
                        paddingLeft: 5,
                        paddingRight: 5,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderWidth: 0.5,
                        borderColor: '#7E7F9A'
                      }}
                    >
                      <View style={{ height: 120 }}>
                        <Image
                          source={
                            e.service == 'uber'
                            ? require(`../assets/pictures/uber-logo.png`)
                            : e.service == 'gojek'
                              ? require(`../assets/pictures/gojek-logo.png`)
                              : require(`../assets/pictures/grab-logo.png`)
                          }
                          style={{ height: 90, width: 90 }}
                        />
                      </View>
                      <View style={{ height: 50 }}>
                        <Text style={{marginBottom: 10}}>
                          {e.price} {e.cheapest && `(CHEAPEST!)`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ gps, main }) => {
  return {
    gps,
    main
  };
};

const StyledApp = styled(Reduxed)`
flex: 1;
backgroundColor: #fff;
`;

const Style = {
  mainTextStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center'
  },
  myPositionStyle: {
    paddingBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    // backgroundColor: '#7E7F9A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#7E7F9A'
  },
  myPositionTextStyle: {
    fontSize: 15,
    marginRight: 10,
    fontWeight: '600',
    left: 20,
    letterSpacing: 2,
    color: '#000',
  },
  poiIndicatorStyle: {
    top: 15,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 13,
    height: 13,
    borderRadius: 60,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-end'
  }
};

export default connect(mapStateToProps)(StyledApp);
