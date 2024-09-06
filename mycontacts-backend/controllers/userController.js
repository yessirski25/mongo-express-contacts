const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async(req,res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("please fill all the required fields");
    }

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //hash the raw password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password is: ", hashedPassword);

    const user = await User.create({ username, email, password: hashedPassword});

    res.json(user);
});
// @desc login a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill in all the fields!");
    }
    const user = await User.findOne({ email });

    //compare password with its hashed version
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401).json({ message: "Either your email or your password is wrong. Please review."});
    }
});
// @desc current user
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async(req,res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
};