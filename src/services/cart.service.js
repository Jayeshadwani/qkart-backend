const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  const cart = await Cart.findOne({email:user.email})
  if(!cart){
    throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart")
  }
  return cart;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  // const {email} = user || ""
  let _cart = await Cart.findOne({email:user.email})
  
  if(!_cart){
    // Create a cart
    _cart = await Cart.create({email:user.email,cartItems:[],paymentOptions:process.env.DEFAULT_PAYMENT_OPTIONS})
    if(!_cart) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR) 
  }

  // check if product already in cart
  let {cartItems} = _cart || []
  let productInCart = cartItems.some((item) => item.product._id == productId)


  if(productInCart) throw new ApiError(httpStatus.BAD_REQUEST,"Product already in cart. Use the cart sidebar to update or remove product from cart")

  // check if product exists
  const product = await Product.findOne({_id:productId})
  
  if(!product) throw new ApiError(httpStatus.BAD_REQUEST,"Product doesn't exist in database")

  cartItems.push({product,quantity})  

  return await _cart.save()
    
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  const {email} = user || ""
  const _cart = await Cart.findOne({email})
  if(!_cart) throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart. Use POST to create cart and add a product")
  
  const _product = await Product.findOne({_id:productId})
  if(!_product) throw new ApiError(httpStatus.BAD_REQUEST,"Product doesn't exist in database")
  
  const {cartItems} = _cart || []

  let productInCart = cartItems[0]
  for (let index = 0; index < cartItems.length; index++) {
    const element = cartItems[index];
    if(element.product._id == productId) {
      productInCart = element
    }
  }

  if(!productInCart) throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart")

  productInCart.quantity = quantity

  return await _cart.save()

};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  const cart = await Cart.findOne({email:user.email});
  if(!cart){
   throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart")
  }
  const productIndex = cart.cartItems.findIndex(item => item.product._id == productId);
 
  if(productIndex ===-1){
   throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart")
  }
 
  cart.cartItems.splice(productIndex,1)
  await cart.save();
};


module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
};