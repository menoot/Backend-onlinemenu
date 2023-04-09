import { menusData } from "../data/index.js";
import helpers from "../helper/validation.js";
import { Router } from "express";
import menus from "../data/menus.js";
const router = Router();

router.route("/:restaurantID").get(async (req, res) => {
  let restaurantID;
  try {
    restaurantID = helpers.validateID(req.params.restaurantID);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const menu = await menusData.getRestaurantFromId(restaurantID);
    res.json(menu);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post("/new", async (req, res) => {
  try {
    const newMenu = req.body.menu;
    const restaurantName = req.body.restaurantName;
    const menuTitle = req.body.title;
    const addedMenu = await menus.addMenu(newMenu, restaurantName, menuTitle);
    res.json(addedMenu);
  } catch (e) {
    res.status(500).json(e);
  }
});

// router
//   .route("/:restaurantName")
//   .get(async (req, res) => {
//     try {
//       req.params.restaurantName = helpers.validateString("Restaurant Name", req.params.restaurantName, String.raw`^[a-zA-Z0-9 '-.]*$`, "The restaurant name must be alphanumeric, space, dash, apostrophe, period.")
//     } catch (e) {
//       return res.status(400).json({error: e});
//     }
//   try {
//     const restaurantName = req.params.restaurantName;
//     const menu = await menusData.getRestaurantFromName(restaurantName);
//     res.json(menu);
//   } catch (e) {
//     res.status(404).json({error: e});
//   }
// });

router.route("/food/:foodId").get(async (req, res) => {
  try {
    req.params.foodId = helpers.validateID(req.params.foodId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const foodId = req.params.foodId;
    const food = await menusData.getFoodById(foodId);
    res.json(food);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export default router;
