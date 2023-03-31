const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const {getUser} = require("../../controllers/user.controller");


const router = express.Router();
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`
router.get("/:userId",validate(userValidation.getUser),getUser)

module.exports = router;
