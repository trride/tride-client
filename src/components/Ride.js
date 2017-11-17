import React from "react";
import { View, Caption } from "@shoutem/ui";
import RideStatus from "./RideStatus";
export default ({ rideData, cancel }) =>
  !rideData.notAsked &&
  !rideData.isLoading &&
  !rideData.hasError && (
    <View style={{ backgroundColor: "#eee", marginTop: "10%" }}>
      <Caption>
        Your order: {rideData.data.service} ID: {rideData.data.requestId}. Tride
        ID: {rideData.data.trideId}
      </Caption>
      <RideStatus trideId={rideData.data.trideId} cancel={cancel} />
    </View>
  );
