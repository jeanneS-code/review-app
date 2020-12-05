import React, { useState ,useEffect, useCallback } from "react"
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
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
  const [addValue, updateValue] = useState("")
  const [formValue ,UpdateFromValue] = useState({
    restaurantName: '',
    address: "",
    lat: '',
    long: '',
    id: '',
    ratings: [],
    time: new Date()
  })

  const updatestate = useEffect(()=>{ //useEffect hooks takes 2 argus, ome is the fuctio, second is an array of only existing items but is watvhed for any vhanges

    if (formValue.restaurantName != ''){ //update markers with restaurant we have
      setMarkers((currentMarker) => [ //all json & created markers
        ...currentMarker, //decstructing the markers
        formValue //the newest marker
      ]) 
    }
   
  },[formValue , selected]) ;//thes aboth strates - the form value & the selected marker

//useCallback is used to memorize the version of event, so it will see this as a new click event not an old one
  const onMapClick = React.useCallback((event) => {

    //to show the form 
      updateForm(true)

      UpdateFromValue ((old)=>{ //old here is the old empty state for new marker to update with event location 
       return {
      ...old,
        lat: event.latLng.lat(),
        long: event.latLng.lng(),
       
        time: new Date()
        }
          
       }
     
      )
  
  }, [showForm]) // to forget the old event and create new event for location mapping 

  //cannot update state directly from child component - Restaurantlist(child) to App(parent)
  //middleware function on the parent
  const restaurantClick = (restaurant) => {
    
    setSelected(restaurant)
  }


  // after subimmting the form from the child form componenet 
  //value is used to hide the form 
  //form is for the form values 
  const closeForm =useCallback((value , form)=>{
// continue to fill the state wit h name and review of the restaurant marker 
    UpdateFromValue((old)=>{
      return {
        ...old ,
        restaurantName : form.title,
        ratings : [{comment : form.review , stars : 4 } ]
         }
      }
    )
// to hide the form after submit with false as vakue 
    updateForm(value)
  } ,[formValue])


  const request = {
    query: "food",
    fields: ["name", "formatted_address", "place_id", "geometry" ,"rating"],
  };

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {  //when map loads, getting the map & paaing to the state
    mapRef.current = map
    const bounds = new window.google.maps.LatLngBounds()

    const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch((
          { location: {lat: 53.349804, lng: -6.26031 },
           radius: 1500, type: "store" })
           , (results, status) => {
     
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {

                map.setCenter(results[0].geometry.location)
          }});


    map.fitBounds(bounds)
    setMap(map)
  }, [])

// for adding reviews to old markeres from json and click 
/**
 * 
 * @param {*} value  from the input inside the info window
 */
const addForm = (event)=>{

  // get the elemnt value by id then pass it the the state from the info window input 
updateValue(event.target.value)

}
// when we click on button inside the info window 
const handleReviewSubmit = ()=>{

  setSelected((old) =>{
return {
  ...old,
  ratings : [...old.ratings ,{comment : addValue , stars : 4 } ]
}
  })
  updateValue("")
}




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
          
          {markers.map((marker ,index) => (
            <Marker
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
                 Reviews 
                </p>
                <p style={{ color: "red", fontWeight: "bold" }}>
               {selected.ratings.map((item)=>(  
                     <p>Review Comment :  {item.comment} Rating :  {item.stars}</p>
                ))}
                  
                </p>
                <p style={{ color: "red", fontWeight: "bold" }}>
               {/* {selected.ratings.map((rev,index,arr)=>(  
                     <p>Rating :  {rev.stars =  rev.stars+rev.stars /arr.length }</p>
                 ))} */}
                  
                </p>
                {/* //add the input and button  */}
                <div>
                
                  <input type="text" value={addValue} id ="add" onChange={addForm} />
                  <button type="but ton" onClick={handleReviewSubmit} >add review </button>
                 
                
                </div>
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
