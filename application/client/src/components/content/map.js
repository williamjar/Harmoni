import React, {Component} from "react";
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import mapStyle from "./mapStyle";
import { OpenStreetMapProvider } from 'leaflet-geosearch'

const provider = new OpenStreetMapProvider();

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
            defaultZoom={15}
            defaultCenter={props.latLng}
            options={{ styles: mapStyle }}
        >
            {props.isMarkerShown && <Marker position= {props.latLng} onClick={props.onMarkerClick} />}
        </GoogleMap>

    );

/**
 * @Class Map Class
 * @classdesc for creating a google maps component with a pin for an event's location, the position (lat long) of the map is decided by leaflet geosearch using OpenStreetMap
 * The parent is responsible for providing a location as promps
 */
export class Map extends Component{

    state = {
        isMarkerShown: true,
        latLng: null,
        location: this.props.location
    };

    componentDidMount(){
        this.getLatLng((results) => {

            if (results.length === 0){
                this.setState({latLng: {lat: 0, lng: 0}});
            }else {
                let lat = parseFloat(results[0].y);
                let lng = parseFloat(results[0].x);

                this.setState({latLng: {lat: lat, lng: lng}});
            }
        })
    }

    /**
     * Responsible for finding the latitude and longitude of an address provided by the parent Component as a prop
     * @param callback to prevent async issues
     * @returns {Promise<void>}
     */
    async getLatLng(callback){
        let results = await provider.search({query: this.state.location});
        callback(results);
    }

    handleMarkerClick = () => {
        console.error("A marker has been clicked, consider this a warning...");
    };

    render(){
        if (this.state.latLng == null){
            return null
        }else{
            return(
                <MapsComponent
                    isMarkerShown = {this.state.isMarkerShown}
                    onMarkerClick = {this.handleMarkerClick}
                    latLng = {this.state.latLng}
                />
            )
        }

    }
}