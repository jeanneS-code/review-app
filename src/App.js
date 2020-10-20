import React, { useState } from "react"
import {
  GoogleMap,
  useLoadScript,
  // withScriptjs,
  // withGoogleMap,
  Marker,
  InfoWindow
  //LoadScript
} from "@react-google-maps/api"

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox"

import "@reach/combobox/styles.css"
import mapStyles from "./mapStyles"
import Restaurantlist from "./Restaurantlist"
import RestaurantData from "./restaurants.json"
import "./App.css"

const libraries = ["places"]

const mapContainerStyle = {
  width: "70vw",
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
  const [map, setMap] = useState(null)

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

  //cannot update state directly from child component - Restaurantlist(child) to App(parent)
  //middleware function on the parent
  const restaurantClick = (restaurant) => {
    console.log("passed value from chiled ", restaurant)
    setSelected(restaurant)
  }

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(9)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  if (loadError) return "Error loading maps"
  if (!isLoaded) return "Loading maps"

  return (
    <div className="App">
      <div style={{ width: "60vw", height: "100vh" }}>
        <Search panTo={panTo} />
        <Locate panTo={panTo} />

        <GoogleMap
          zoom={10} //zoom level when the map loads for the first time
          center={{ lat: 53.349804, lng: -6.26031 }} //where the map will be centered(my hard coded position)
          options={options}
          mapContainerStyle={mapContainerStyle}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          <Marker
            position={{
              lat: 53.349804,
              lng: -6.26031
            }}
            icon={{
              url: "/beachflag.png"
            }}
          />
          {RestaurantData.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{
                lat: restaurant.lat,
                lng: restaurant.long
              }}
              onClick={() => {
                setSelected(restaurant)
              }}
              icon={{
                url: "/download.svg",
                scaledSize: window.google
                  ? new window.google.maps.Size(25, 25)
                  : { width: 50, height: 50 }
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
                <h2>{selected.id}</h2>
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
        <Restaurantlist
          openMaker={(restaurant) => restaurantClick(restaurant)}
        />
      </div>
    </div>
  )
}

export default App

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position)
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          },
          () => null
        )
      }}
    >
      <img src="compass.svg" alt="compass - locate me!" />
    </button>
  )
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 53.349804, lng: () => -6.26031 },
      radius: 200 * 1000
    }
  })

  return (
    <div className="search">
      <Combobox
        onSelect={async (address) => {
          setValue(address, false)
          clearSuggestions()
          try {
            const results = await getGeocode({ address })
            const { lat, lng } = await getLatLng(results[0])
            panTo({ lat, lng })
          } catch (error) {
            console.log("Error!")
          }
          console.log(address)
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          /* disabled={!ready}*/
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}
