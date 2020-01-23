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
        latLng: null,
        location: this.props.location
    };

    componentDidMount(){
        console.log("Location: " + this.props.location);
        this.getLatLng((results) => {
            console.log("Results from OpenStreetMap:");
            console.log(results);

            if (results.length == 0){
                this.setState({latLng: {lat: 0, lng: 0}});
            }else {
                let lat = parseFloat(results[0].y);
                let lng = parseFloat(results[0].x);

                this.setState({latLng: {lat: lat, lng: lng}});
            }



        })
    }

    async getLatLng(callback){
        let results = await provider.search({query: this.state.location});
        callback(results);
    }

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