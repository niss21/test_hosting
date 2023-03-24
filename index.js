const express = require("express")
const app = express()
var cors = require('cors')

const auth_route = require("./route/auth")
const jobs_route = require("./route/jobs")
const jobapplied_route = require("./route/jobapplied")

require('dotenv').config() 
app.use(cors())
app.use(express.json())   

app.use(express.static('uploads'))

app.use("/api", auth_route)
app.use("/api", jobs_route)
app.use("/api", jobapplied_route)

app.get("/", (req, res) => {
    res.send("welcome to express")
})


app.use((err, req, res, next) => {

    let status_code = 500;
    let msg = "Server Error"
    let errors = [];

    console.log(err.name)
    console.log("code", err.code)

    if (err.name == "ValidationError") {
        status_code = 400;
        msg = "Bad request"

        Object.entries(err.errors).map(error => {
            errors.push({
                param: error[0],
                msg: error[1].message
            })
        })
    } else {
        if (err.code == 11000) {
            status_code = 400;
            msg = "Bad request"
            errors.push({
                param: "email",
                msg: "Duplicate email "
            })
        }
    }

    res.status(status_code).send({
        msg: msg,
        errors,
        error: err.message
    })
})

// require("./config/database")

require("./db/conn");


app.listen(process.env.PORT, () => {
    console.log("server started. ");
})