const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please put a username"],
    },
    email: {
        type: String,
        required: [true, "please put an email"],
        unique: [true, "email already taken"]
    },
    password: {
        type: String,
        required: [true, "please put a password"],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);