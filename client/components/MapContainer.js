import React, { Component } from "react";
import { connect } from "react-redux";
import { GoogleApiWrapper, Map, Marker, InfoWindow } from "google-maps-react";
import store from "../store";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  onMarkerClick(props, marker, e) {
    console.log("props", props);
    console.log("marker", marker);

    this.setState({
      showInfoWindow: true,
      activeMarker: marker,
      selectedPlace: props
    });
  }

  render() {
    if (!this.props.loaded || !this.state) {
      return <div>Loading...</div>;
    }

    const { onMarkerClick } = this;
    const { google, map } = this.props;
    const { showInfoWindow, activeMarker, selectedPlace } = this.state;
    const style = {
      width: "97%",
      height: "500px",
      position: "center"
    };

    return (
      <div>
        <Map
          google={google}
          style={style}
          initialCenter={{ lat: 40.752051, lng: -73.957088 }}
          zoom={12}
        >
          <Marker
            onClick={onMarkerClick}
            title={"Your Starting Destination"}
            name={"User Start"}
            position={{ lat: map.userStart.lat, lng: map.userStart.lng }}
          />
          <Marker
            onClick={onMarkerClick}
            title={"Friend's Starting Destination"}
            name={"Friend Start"}
            position={{ lat: map.friendStart.lat, lng: map.friendStart.lng }}
          />
          <Marker
            onClick={onMarkerClick}
            title={"Meeting Destination"}
            name={"Meeting Destination"}
            position={{
              lat: map.meetingDestination.lat,
              lng: map.meetingDestination.lng
            }}
          />
          <InfoWindow marker={activeMarker} visible={showInfoWindow}>
            <div>
              <h4>{selectedPlace.name}</h4>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

const mapState = ({ user, map }) => {
  return {
    user,
    map
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(mapState, mapDispatch)(
  GoogleApiWrapper({
    apiKey: "AIzaSyAopJDwUG1vlrsZg94qP6yuPtzapUgYw8g"
  })(MapContainer)
);
