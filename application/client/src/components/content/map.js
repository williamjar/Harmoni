import React, {Component} from "react";
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete"
import mapStyle from "./mapStyle";

const MapsComponent =

    compose(  withProps({
            googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBekue27ciYidD7LztuCQu6ERjcioCUfkI&v=3.exp&libraries=geometry,drawing,places",
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: `400px` }} />,
            mapElement: <div style={{ height: `100%` }} />,
        }),
        withScriptjs,
        withGoogleMap
    )((props) =>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={props.latLng}
            options={{ styles: mapStyle }}
        >
            {props.isMarkerShown && <Marker position= {props.latLng} onClick={props.onMarkerClick} />}
        </GoogleMap>

    );

export class Map extends Component{

    state = {
        isMarkerShown: true,
        /*latLng: null,*/
    };

    componentDidMount(){
        /*this.getLatLng((res) => {
            console.log("Results:");
            console.log(res);
            this.setState({latLng: res})
        })*/
    }
/*
    async getLatLng(callback){
        let results = await geocodeByAddress("Toronto, ON, Canada");
        let latLng = await getLatLng(results[0]);
        callback({lat: -10, lng: -10});
    }*/

    /*
    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({isMarkerShown: false})
        }, 3000)
    }*/

    handleMarkerClick = () => {
        console.error("A marker has been clicked, consider this a warning...");
    };

    render(){
        return(
            <MapsComponent
                isMarkerShown = {this.state.isMarkerShown}
                onMarkerClick = {this.handleMarkerClick}
                latLng = {this.props.latLng}
            />
        )
    }
}