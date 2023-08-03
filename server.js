const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const port = 3000;
const bodyParser = require("body-parser");
const use = require("./models/userschema");
const auth=require("./auth/auth")
app.use(cors());
const Token_Key = "45656575757577567776765757575757";
const bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const mongoURI =
  "mongodb+srv://hammas:hammas123@cluster0.xqevkjl.mongodb.net/user";

//connecting to the mongo db
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post("/signup", async (req, res, next)=> {
  try {
    const { email, password, username, createdAt } = req.body;
    if (!(username && password && email)) {
      return res.json({ message: "Credentials is Required" });
    }
    const existingUser = await use.findOne({ username });
    if (existingUser) {
      return res.json({ message: "User exists already" });
    }
    const user = await use.create({ email, password, username, createdAt });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, Token_Key, {
        expiresIn: "2h",
      });
      user.token = token;
    }
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true,user});
  } catch (error) {
    console.error(error);
  }
});

//Login end point hitting

app.post("/login", async (req, res) => {
  try {
    const { email, password,username } = req.body;
    if (!(email && password)) {
      res.json({message:"All fields are required"})
    }
  
    const user = await use.findOne({ email });
    // console.log(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        Token_Key,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;


      res.status(200).json({message:"userlogged in succesfully",email});
    }
    res.status(201).json({message:"Wrong email,username OR Password!"})
  } catch (err) {
    console.log(err);
  }
});

app.post("/welcome", auth,(req, res) => {
  const { email } = req.user;
  res.json({ message: 'Authenticated successfully',email });


})





 
  





