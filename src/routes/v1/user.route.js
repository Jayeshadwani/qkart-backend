const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const {getUser} = require("../../controllers/user.controller");
const userController = require("../../controllers/user.controller");
const auth = require("../../middlewares/auth");


const router = express.Router();

/*

Routes Implemented:
POST auth/register -> takes user info and gives a access-token
GET users/:userId -> validates the access-token and gives user info


Middlewares
1. auth = checks if the token is valid(Passport Strategy)
2. validate = checks if the userId is valid(Joi Schema)
*/ 

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`
router.get("/:userId",auth,validate(userValidation.getUser),getUser)



module.exports = router;
