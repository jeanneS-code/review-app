import React, { useState ,useEffect, useCallback } from "react"
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
import Form from './Form'
//mport { defaultLoadScriptProps } from "@react-google-maps/api/dist/LoadScript"
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

//the form should be hidden when the map loads
//the info window is hidden so surely I can do the same here
//when a user clicks either on a marker or on the map the form should launch
//the user can input and submit a review
//the form is then hidden again
//a new marker is added to the map for a new restaurant
const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const [markers, setMarkers] = React.useState([]) //when a user clicks on map where no marker, add marker
  const [selected, setSelected] = useState(null) //click on a marker on the map, launch info window
  const [map, setMap] = useState(null) //not sure what this does
  const [showForm, updateForm] = useState(false)
  const [formValue ,UpdateFromValue] = useState({
    restaurantName: '',
    address: "",
    lat: '',
    long: '',
    id: '',
    ratings: [],
    /*ratings: 
      {
        "stars": '',
        "comment": ''
      }
    ,*/
    
   
    time: new Date()
  })

  const updatestate = useEffect(()=>{

    if (formValue.restaurantName != ''){
      setMarkers((currentMarker) => [
        ...currentMarker,
        formValue
      ]) 
    }
   
    console.log('state  changes')
  },[formValue])

  //is the only purpose for this function to record the location on the map that was clicked
  //and update state with thosecordinates?
  //how do I do this for my form? I've tried and gotten nowhere
  const onMapClick = React.useCallback((event) => {

    //to show the form 
      updateForm(true)


      console.log('before the state update ', formValue)
      UpdateFromValue ((old)=>{
       return {
      ...old,
        lat: event.latLng.lat(),
        long: event.latLng.lng(),
       
        time: new Date()
        }
          
       }
     
      )
     
      console.log('after the state update with lat  ', formValue)
      
     
       //UpdateFromValue() // reset like the form
    
  }, [showForm])

  //cannot update state directly from child component - Restaurantlist(child) to App(parent)
  //middleware function on the parent
  const restaurantClick = (restaurant) => {
    
    setSelected(restaurant)
  }
  const closeForm =useCallback((value , form)=>{

    console.log('event started' ,form)
    
    console.log('before the state update with res  ', formValue)
    UpdateFromValue((old)=>{
      return {
        ...old ,
        restaurantName : form.title,
        /*ratings["comment"]: form.review,*/
          ratings : [{comment : form.review , stars : 4 } ]
         }
      }
    )
    console.log('after the state update with res  ', formValue)

   
    updateForm(value)
  } ,[formValue])

  const request = {
    // placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    query: "food",
    fields: ["name", "formatted_address", "place_id", "geometry" ,"rating"],
  };

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
    const bounds = new window.google.maps.LatLngBounds()

    const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch((
          { location: {lat: 53.349804, lng: -6.26031 },
           radius: 1500, type: "store" })
           , (results, status) => {
         // console.log(results)
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            
            
            // setMarkers(current =>{
            //     [...current].concat(results )
            // } )
            map.setCenter(results[0].geometry.location)
          }});


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

 //I'm not sure what any of the code is doing below
 //why have an onClick property added to the local json markers - so if you click one you get the info window?
 //what's {markers.map((marker) doing?
 //i think mapping over the markers state where the coordinates are stored is to render the markers
 //maybe move that markers mapping inside the Form compnent - we only want a marker added after form submitted
 //when I do add a new marker by clicking on the map, if i then click that marker i get errors & no info window
 //what's the difference between passing a marker and a restaurant to setSelected below

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
          
          {markers.map((marker ,index) => (
            <Marker
              // key={marker.time.toISOString()}
              key ={index}
              position={{ lat: marker.lat, lng: marker.long }}
              icon={{
                url: "/download.svg",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15)
              }}
              onClick={() => {
                console.log(marker)
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
        <Restaurantlist  list ={markers}
          openMaker={(restaurant) => restaurantClick(restaurant)}
        />
      </div>
      {showForm && ( 
             <Form closeFrom = {(value ,form)=>closeForm (value ,form)} />
          )}
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
      <img src="compass.png" alt="compass - locate me!" />
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
