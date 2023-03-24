const { body } = require('express-validator');

const expressValidate = require("./expressValidate")
const jwt = require("jsonwebtoken")

const login_middeware = expressValidate([
    body('email').notEmpty().withMessage("required field"),
    body('password').notEmpty().withMessage("required field")
])

const signup_middeware = expressValidate([
    body('name').notEmpty().withMessage("required field"),
    body('email').notEmpty().withMessage("required field"),
    body('role').notEmpty().withMessage("required field"),
    body('password').notEmpty().withMessage("required field")
])

const checkAuthentication = async (req, res, next) => {
    let logged = false;
    console.log("here");
    let token = req.headers.authorization?.split(" ")[1] || null
    if (token) {
        console.log(token);
        try {
            let decoded = jwt.verify(token, 'shhhhh');
            req.user = decoded
            // console.log(decoded);
            if (decoded) {
                console.log("done");
                return next();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    res.status(401).send({
        data: "not logged in. "
    })
}

const isRecruiter = (req, res, next) => {
    if (req.user.role == "recruiter") {
        return next()
    }
    else {
        return res.status(403).send({
            data: "Access denied"
        })
    }
}

const isApplicant = (req, res, next) => {
    if (req.user.role == "applicant") {
        return next()
    }
    else {
        return res.status(403).send({
            data: "Access denied"
        })
    }
}

module.exports = {
    login_middeware,
    signup_middeware,
    checkAuthentication,
    isRecruiter,
    isApplicant
}