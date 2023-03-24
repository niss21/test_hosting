const express = require("express");

const { isRecruiter, checkAuthentication } = require("../middleware/auth")
const { getalljobs,getjobs,getjobbyid,postjobs,putjob,deletejob } = require("../controller/jobs");

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)

        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage })

const path = require("path")
const router = express.Router();

router.get("/jobs", getjobs)
router.get("/alljobs", getalljobs)
router.post("/jobs", checkAuthentication, isRecruiter, upload.array('images', 12), postjobs)
router.put("/jobs/:id", checkAuthentication, isRecruiter, upload.array('images', 12),putjob)
router.get("/jobs/:id", upload.array('images', 12), getjobbyid)
router.delete("/jobs/:id", checkAuthentication, isRecruiter, deletejob)

module.exports = router;
