import {Router} from 'express';
import dotenv from 'dotenv';
import {menusData} from '../data/index.js';
import Stripe from 'stripe';

dotenv.config()

const router = Router();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);


router
  .route("/create-checkout-session")
  .post(async (req, res) => {
  try {
    const restaurant = req.body.restaurant;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const returnedFood = Object.values(restaurant.sections).flat().find((food) => {return food._id === item.id})
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: returnedFood.name,
            },
            unit_amount: returnedFood.price,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failure`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router;