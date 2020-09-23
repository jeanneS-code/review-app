import React, { useState } from "react"
import {
  GoogleMap,
  //withScriptjs,
  //withGoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps"
//import { useLoadScript } from "@react-google-maps/api"

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

/*import mapStyles from "./mapStyles"*/
import RestaurantData from "./restaurants.json"

export default function MyMap() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  return (
    <GoogleMap
      defaultZoom={10} //zoom level when the map loads for the first time
      defaultCenter={{ lat: 53.349804, lng: -6.26031 }} //where the map will be centered(my hard coded position)
    >
      {RestaurantData.map((restaurant) => (
        <Marker
          key={restaurant.restaurantName}
          position={{
            lat: restaurant.lat,
            lng: restaurant.long
          }}
          onClick={() => {
            setSelectedRestaurant(restaurant)
          }}
          icon={{
            url: "/download.svg",
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))}
      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.lat,
            lng: selectedRestaurant.long
          }}
          onCloseClick={() => {
            setSelectedRestaurant(null)
          }}
        >
          <div>
            <h2>{selectedRestaurant.restaurantName}</h2>
            <p style={{ color: "red", fontWeight: "bold" }}>
              Star Rating : {selectedRestaurant.ratings[0].stars}
            </p>
            <p style={{ color: "red", fontWeight: "bold" }}>
              Review Comment : {selectedRestaurant.ratings[0].comment}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
