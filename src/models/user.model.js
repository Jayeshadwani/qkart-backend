const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/.js
const validator = require("validator");
const bcrypt = require("bcryptjs")
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type : String,
      required: true,
      trim:true,
      unique:true,
      lowercase:true,
      validate: (email) => {
        if(!validator.isEmail(email)){
          throw new Error("Invalid email")
        }
      }
    },
    password: {
      type: String,
      required:true,
      trim:true,
      min:8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type:Number,
      required : true,
      default : 500
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
  );
  
  
  
  // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
  /**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
      const _user = await User.find({email:email})
      return _user.length ? true : false
};


// TODO Implement hashing password with mongoose 
// userSchema.pre('save', function(next){
//   var user = this
//   if(!user.isModified('password')) return next()
//   bcrypt.genSalt(10,function(err,salt){
//     if(err) return next(err)
//     bcrypt.hash(user.password,salt,function(err,hash){
//       if(err) return next(err)
//       user.password = hash
//       next()
//     })
//   })
// })

userSchema.methods.isPasswordMatch = async function(password){
  console.log(await bcrypt.compare(password,this.password),"[compare]")
  return bcrypt.compare(password, this.password)
}



// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User
 */
/**
 * @typedef User
 */
const User = mongoose.model("User",userSchema)

module.exports = {User}

