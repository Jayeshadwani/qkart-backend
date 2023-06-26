const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const { getUserById,getUserAddressById } = require("../services/user.service");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUser() function
/**
 * Get user details
 *  - Use service layer to get User data
 * 
 *  - If query param, "q" equals "address", return only the address field of the user
 *  - Else,
 *  - Return the whole user object fetched from Mongo

 *  - If data exists for the provided "userId", return 200 status code and the object
 *  - If data doesn't exist, throw an error using `ApiError` class
 *    - Status code should be "404 NOT FOUND"
 *    - Error message, "User not found"
 *  - If the user whose token is provided and user whose data to be fetched don't match, throw `ApiError`
 *    - Status code should be "403 FORBIDDEN"
 *    - Error message, "User not found"
 *
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3
 * Response - 
 * {
 *     "walletMoney": 500,
 *     "address": "ADDRESS_NOT_SET",
 *     "_id": "6010008e6c3477697e8eaba3",
 *     "name": "crio-users",
 *     "email": "crio-user@gmail.com",
 *     "password": "criouser123",
 *     "createdAt": "2021-01-26T11:44:14.544Z",
 *     "updatedAt": "2021-01-26T11:44:14.544Z",
 *     "__v": 0
 * }
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 * userID 1 -> token1 -> access
 * userID 2 -> token2 -> access
 * userID1 -> token2 -> no-access
 * 
 
 */
const getUser = catchAsync(async (req, res) => {
  const {q} = req.query
  const {userId} = req.params
  let data;

  if(q === "address"){
    data = await userService.getUserAddressById(userId)
  }
  else{
   data = await userService.getUserById(userId)
  }

  if (data.email !== req.user.email){
    throw new ApiError(httpStatus.FORBIDDEN, "User not Authenticated to see other user's data");
  }

  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND,"User Not Found")
  }

  if(q ==="address"){
    res.send({
      address:data.address
    })
  }
  else{
  res.send(data)
  }
});


/*
* * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3?q=address
* Response - 
* {
  *   "address": "ADDRESS_NOT_SET"
  * }
  * 
  *
  * Example response status codes:
  * HTTP 200 - If request successfully completes
  * HTTP 403 - If request data doesn't match that of authenticated user
  * HTTP 404 - If user entity not found in DB
  * 
  * @returns {User | {address: String}}
  **/
 const setAddress = catchAsync(async (req, res) => {
  const {userId} = req.params
  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.send({
    address: address,
  });
  
    });
    

    
    module.exports = {
      getUser,
      setAddress,
    
    }