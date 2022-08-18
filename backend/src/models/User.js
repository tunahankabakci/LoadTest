const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    max:40,
    min:2,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
    max:15,
    min:3,
  },
  password: {
    type: String,
    required: true,
    max:25,
    min:3,
    trim:true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error({ error: "Invalid login credentials"});
  }
  const isPasswordMatch = password == user.password
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};



const User = mongoose.model("User", userSchema);
module.exports = User;