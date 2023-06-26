const mongoose = require('mongoose');
const { productSchema } = require('./product.model');
const config = require("../config/config")
const validator = require("validator");


// TODO: CRIO_TASK_MODULE_CART - Complete cartSchema, a Mongoose schema for "carts" collection
const cartSchema = mongoose.Schema(
  {
    email:{
      type:String,
      required:true,
      unique:true,
      trim:true,
      lowercase:true,
      validate: (email) => {
        if(!validator.isEmail(email)){
          throw new Error("Invalid email")
        }
      }
    },
    cartItems:[{product: productSchema,quantity:Number }],
    paymentOption:{
      type:String,
      default:config.default_payment_option
    }
  },
  {
    timestamps: false,
  }
);


/**
 * @typedef Cart
 */
const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;