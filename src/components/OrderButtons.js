import React, { Component } from "react";
import {
  View,
  Text,
  Caption,
  Image,
  Tile,
  Title,
  Subtitle,
  Heading,
  Button,
  Row,
  Spinner,
  ListView,
  GridRow
} from "@shoutem/ui";

const renderPriceRow = (rowData, sectionId, index) => {
  if (index === "0") {
    return (
      <View style={{ backgroundColor: "#eee", marginTop: "10%" }}>
        <Image
          styleName="featured"
          style={{ width: "100%" }}
          source={{
            uri: "https://shoutem.github.io/img/ui-toolkit/examples/image-2.png"
          }}
        >
          <Tile>
            <Title>Cheapest: {rowData[0].service}</Title>
            <Subtitle styleName="sm-gutter-top">{rowData[0].price}</Subtitle>
            <Button styleName="md-gutter-top">
              <Text>Order cheapest: {rowData[0].service}</Text>
            </Button>
          </Tile>
        </Image>
      </View>
    );
  }
  const cellViews = rowData.map(
    ({ service, price, cheapest, requestKey: { key } }) => (
      <View style={{ backgroundColor: "#eee", marginTop: "10%" }} key={key}>
        <Image
          styleName={"large-portrait"}
          style={{ width: "100%" }}
          source={{
            uri: "https://shoutem.github.io/img/ui-toolkit/examples/image-3.png"
          }}
        >
          <Tile>
            <Title>{service}</Title>
            <Heading>{price}</Heading>
            <Button styleName="md-gutter-top">
              <Text>Order {service}</Text>
            </Button>
          </Tile>
        </Image>
      </View>
      //   <View style={{ backgroundColor: "#eee", marginTop: "10%" }} key={key}>
      // <Image
      //   style={{ width: "100%" }}
      //   source={{
      //     uri: "https://shoutem.github.io/img/ui-toolkit/examples/image-9.png"
      //   }}
      // >
      //     <Tile>
      //       <Title>{service}</Title>
      //       <Heading>{price}</Heading>
      //       <Button styleName="md-gutter-top">
      //         <Text>Order {service}</Text>
      //       </Button>
      //     </Tile>
      //   </Image>
      //   </View>
    )
  );
  return <GridRow columns={2}>{cellViews}</GridRow>;
};

export default ({ selectedPlace, priceComparisons }) => {
  let isFirst = true;
  const groupedData =
    !priceComparisons.notAsked &&
    !priceComparisons.isLoading &&
    !priceComparisons.hasError &&
    GridRow.groupByRows(priceComparisons.data, 2, () => {
      if (isFirst) {
        isFirst = false;
        return 2;
      }
      return 1;
    });

  return (
    !selectedPlace.notAsked && (
      <View style={{ backgroundColor: "#eee", marginTop: "10%" }}>
        <Caption>
          Tujuan:{" "}
          {selectedPlace.isLoading
            ? "Loading coordinates of selected place"
            : selectedPlace.hasError
              ? "Coordinates of destination can't be fetched"
              : selectedPlace.data.address}
        </Caption>
        {!priceComparisons.notAsked &&
          (priceComparisons.isLoading ? (
            <View style={{ backgroundColor: "#eee", marginTop: "10%" }}>
              <Row>
                <Spinner />
                <Caption> Finding the best price</Caption>
              </Row>
            </View>
          ) : priceComparisons.hasError ? (
            <View style={{ backgroundColor: "#eee", marginTop: "10%" }}>
              <Text>There's an error when we were getting the price.</Text>
            </View>
          ) : (
            <ListView data={groupedData} renderRow={renderPriceRow} />
          ))}
      </View>
    )
  );
};
