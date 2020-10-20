import React, { Component } from "react"
import RestaurantData from "./restaurants.json"

class Restaurantlist extends Component {
  Openmarker(restaurant) {
    console.log(restaurant)
    this.props.openMaker(restaurant)
  }
  render() {
    return (
      <div>
        <h1>Restaurants</h1>
        {RestaurantData.map((RestaurantDetail, index) => {
          return (
            <div key={index}>
              <h3 onClick={() => this.Openmarker(RestaurantDetail)}>
                {RestaurantDetail.restaurantName}
              </h3>
              <p>{RestaurantDetail.address}</p>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Restaurantlist
