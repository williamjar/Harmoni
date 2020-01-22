import React, {Component} from "react";
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"

const MapsComponent =

    compose(  withProps({
            googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: `400px` }} />,
            mapElement: <div style={{ height: `100%` }} />,
        }),
        withScriptjs,
        withGoogleMap
    )((props) =>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={props.position}
        >
            {props.isMarkerShown && <Marker position= {props.position} onClick={props.onMarkerClick} />}
        </GoogleMap>

    );

export class Map extends Component{

    state = {
        isMarkerShown: true,
    };

    componentDidMount(){
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
        return(
            <MapsComponent
                isMarkerShown = {this.state.isMarkerShown}
                onMarkerClick = {this.handleMarkerClick}
                position = {{lat: 66.4857, lng: 13.5622}}
            />
        )
    }
}