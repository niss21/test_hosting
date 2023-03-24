const Jobapplied = require("../model/Jobapplied")

const getAppliedjobs = async (req, res, next) => {
    let jobsapplied = await Jobapplied.find({ created_by: req.user._id })
    .populate({path:'jobs.job_id', select:[ 'title', 'company']});
    res.send(jobsapplied)
}

const appliedjobs = async (req, res, next) => {
    try {

        console.log(req.body.jobs);

        let jobapplied = await Jobapplied.create({
            jobs: req.body.jobs,
            title:req.body.jobs.title,
            created_by: req.user._id
        })

        // console.log("21");
        // console.log(jobapplied);

        res.send(jobapplied)
    }
    catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    getAppliedjobs,
    appliedjobs
}