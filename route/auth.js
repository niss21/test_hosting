const express = require("express");

const router = express.Router();
const { body,validationResult } = require('express-validator');
const jwt = require("jsonwebtoken")

const { login, signup } = require("../controller/auth")
const { login_middeware } = require("../middleware/auth")

const User = require("../model/User")

router.post("/login", login_middeware, login)

router.post("/signup", 
    body('name').notEmpty().withMessage("required field"),
    body('email').notEmpty().withMessage("required field"),
    body('role').notEmpty().withMessage("required field"), 
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }, signup)

router.get("/users", async (req, res, next) => {

    let token = req.headers.authorization?.split(" ")[1] || null
    if (token) {
        try {
            let user = await jwt.verify(token, 'shhhhh');
            console.log(user);
            res.send({
                data: user,
            })

        }
        catch (err) {
            console.log(err);
        }
    }

})

module.exports = router