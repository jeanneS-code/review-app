import { hot } from "react-hot-loader/root"
import React, { useState } from "react"
import {
  GoogleMap,
  useLoadScript,
  //withScriptjs,
  //withGoogleMap,
  Marker,
  InfoWindow
} from "@react-google-maps/api"

/*import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox"*/

import "@reach/combobox/styles.css"
import mapStyles from "./mapStyles"
import Restaurantlist from "./Restaurantlist"
import RestaurantData from "./restaurants.json"
import "./App.css"

const libraries = ["places"]

const mapContainerStyle = {
  width: "100vw",
  height: "100vh"
}

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
}

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const [markers, setMarkers] = React.useState([])
  const [selected, setSelected] = useState(null)

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date()
      }
    ])
  }, [])

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])

  if (loadError) return "Error loading maps"
  if (!isLoaded) return "Loading maps"

  return (
    <div className="App">
      <div style={{ width: "60vw", height: "100vh" }}>
        <GoogleMap
          defaultZoom={10} //zoom level when the map loads for the first time
          defaultCenter={{ lat: 53.349804, lng: -6.26031 }} //where the map will be centered(my hard coded position)
          options={options}
          mapContainerStyle={mapContainerStyle}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {RestaurantData.map((restaurant) => (
            <Marker
              key={restaurant.restaurantName}
              position={{
                lat: restaurant.lat,
                lng: restaurant.long
              }}
              onClick={() => {
                setSelected(restaurant)
              }}
              icon={{
                url: "/download.svg",
                scaledSize: new window.google.maps.Size(25, 25)
              }}
            />
          ))}
          {markers.map((marker) => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: "/download.svg",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15)
              }}
              onClick={() => {
                setSelected(marker)
              }}
            />
          ))}
          {selected && (
            <InfoWindow
              position={{
                lat: selected.lat,
                lng: selected.long
              }}
              onCloseClick={() => {
                setSelected(null)
              }}
            >
              <div>
                <h2>{selected.restaurantName}</h2>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Star Rating : {selected.ratings[0].stars}
                </p>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Review Comment : {selected.ratings[0].comment}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      <div className="restaurant-wrapper">
        <Restaurantlist />
      </div>
    </div>
  )
}
export default hot(App)
