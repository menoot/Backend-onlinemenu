import {menus} from '../config/mongoCollections.js';
import helpers from '../helper/validation.js'; 
import {ObjectId} from 'mongodb';


//Axios call to get all data of a given restaurant id
let exportedMethods ={ 
  getRestaurantFromName : async (
    restaurantName
    ) => {
      restaurantName = helpers.validateString("Restaurant Name", restaurantName, String.raw`^[a-zA-Z0-9 '-.]*$`, "The restaurant name must be alphanumeric, space, dash, apostrophe, period.")
    

      const menusCollection = await menus();
      
      let restaurantList = await menusCollection.find({}).toArray();
      if (!restaurantList) throw 'Could not get all the restaurants';

      // get the user from the db based on the username
      let returnRestaurant;
      let matchingRestaurant = restaurantList.filter( (restaurant) => {
        return restaurant.restaurantName.toLowerCase() === restaurantName.toLowerCase()} ) ; //make case insensitive  
      if (matchingRestaurant.length === 0){
        //User does not exists
        throw "No restaurant is found"
      }else{
        returnRestaurant = matchingRestaurant[0];
      }
      
      return returnRestaurant;
  },
  getRestaurantFromId : async (
    restaurantID
    ) => {
      restaurantID = helpers.validateID(restaurantID)
    

      const menusCollection = await menus();
      
      const restaurant = await menusCollection.findOne({_id: ObjectId(restaurantID)});
      if (restaurant === null) throw 'No restaurant with that id';
      restaurant._id = await restaurant._id.toString(); //Why need await? Call method on a promise. IDK but without await it is equal to the function and not return
      return restaurant;
  }


}
export default exportedMethods;