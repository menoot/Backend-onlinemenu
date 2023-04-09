import { menus } from "../config/mongoCollections.js";
import helpers from "../helper/validation.js";
import { ObjectId } from "mongodb";

//Axios call to get all data of a given restaurant id
let exportedMethods = {
  getRestaurantFromName: async (restaurantName) => {
    restaurantName = helpers.validateString(
      "Restaurant Name",
      restaurantName,
      String.raw`^[a-zA-Z0-9 '-.]*$`,
      "The restaurant name must be alphanumeric, space, dash, apostrophe, period."
    );

    const menusCollection = await menus();

    let restaurantList = await menusCollection.find({}).toArray();
    if (!restaurantList) throw "Could not get all the restaurants";

    // get the user from the db based on the username
    let returnRestaurant;
    let matchingRestaurant = restaurantList.filter((restaurant) => {
      return (
        restaurant.restaurantName.toLowerCase() === restaurantName.toLowerCase()
      );
    }); //make case insensitive
    if (matchingRestaurant.length === 0) {
      //User does not exists
      throw "No restaurant is found";
    } else {
      returnRestaurant = matchingRestaurant[0];
    }

    return returnRestaurant;
  },
  getRestaurantFromId: async (restaurantID) => {
    restaurantID = helpers.validateID(restaurantID);

    const menusCollection = await menus();

    const restaurant = await menusCollection.findOne({
      _id: ObjectId(restaurantID),
    });
    if (restaurant === null) throw "No restaurant with that id";
    restaurant._id = await restaurant._id.toString(); //Why need await? Call method on a promise. IDK but without await it is equal to the function and not return
    return restaurant;
  },
  getMenuByRestaurantName: async (restaurantName) => {
    if (!restaurantName)
      throw "You must provide a restaurant name to search for";
    if (typeof restaurantName !== "string")
      throw "You must provide a string for the restaurant name";

    const menuCollection = await menus();
    const menu = await menuCollection.findOne({
      restaurantName: restaurantName,
    });
    if (menu === null) throw "No menu with that restaurant name";

    return menu;
  },

  getMenuById: async (id) => {
    if (uuid.validate(id) === false) throw "You must provide a valid id";
    const menuCollection = await menus();
    const menu = await menuCollection.findOne({ _id: id });
    if (menu === null) throw "No menu with that id";

    return menu;
  },

  addMenu: async (menu, restaurantName, menuTitle) => {
    if (!menu) throw "You must provide a menu to add";
    if (typeof menu !== "object")
      throw "You must provide an object for the menu";

    if (!restaurantName)
      throw "You must provide a restaurant name to search for";
    if (typeof restaurantName !== "string")
      throw "You must provide a string for the restaurant name";

    for (const section in menu) {
      for (let i = 0; i < menu[section].length; i++) {
        menu[section][i]._id = new ObjectId();
      }
    }

    const menuCollection = await menus();
    const arr = Object.entries(menu);

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i][1].length; j++) {
        arr[i][1][j].price = arr[i][1][j].price * 100;
      }
    }

    const newMenu = {
      restaurantName: restaurantName,
      title: menuTitle,
      sections: menu,
    };
    const newInsertInformation = await menuCollection.insertOne(newMenu);
    if (newInsertInformation.insertedCount === 0) throw "Could not add menu";

    const newId = newInsertInformation.insertedId;
    const menuAdded = await menuCollection.findOne({ _id: newId });
    return menuAdded;
  },
};
export default exportedMethods;
