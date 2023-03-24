const Jobs = require("../model/Jobs")

const postjobs = async (req, res, next) => {
    try {
        let images = req.files.map(file => file.filename)
        let jobs = await Jobs.create({ ...req.body, created_by: req.user._id, images })
        res.send(jobs)
    }
    catch (err) {
        next(err)
    }
}

const putjob = async (req, res, next) => {
    let db_jobs = await Jobs.findById(req.params.id)
    let recruiter_id = db_jobs.created_by
    console.log({ recruiter_id });
    if (req.user._id != recruiter_id) {
        return res.status(403).send({
            data: "Not valid seller.. "
        })

    }

    console.log(req.params);
    console.log("update");

    try {
        let jobs = await Jobs.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
        res.send(jobs)
    } catch (error) {
        console.log(error);
    }
}

const deletejob = async (req, res, next) => {
    try {
        console.log("current-user-id", req.user._id)
        let db_jobs = await Jobs.findById(req.params.id)
        let recruiter_id = db_jobs.created_by
        console.log({ recruiter_id });
        if (req.user._id != recruiter_id) {
            return res.status(403).send({
                data: "Not valid seller.. "
            })
        }
        let jobs = await Jobs.findByIdAndDelete(req.params.id)
        res.send({
            data: jobs
        })
    }
    catch (err) {
        next(err)
    }
}

const getjobs = async (req, res, next) => {
    let per_page = parseInt(req.query.per_page) || 12;
    let page = parseInt(req.query.page) || 1
    let jobs = await Jobs.aggregate([
        {
            $match: {
                title: RegExp(`${req.query.search_term}`, "i")
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "created_by"
            }
        },
        {
            $unwind: "$created_by"
        },
        {
            $project: {
                "created_by.password": 0
            }
        },
        {
            $skip: (page - 1) * per_page
        },
        {
            $limit: per_page
        },
    ])

    let jobs_count = await Jobs.aggregate([
        {
            $match: {
                title: RegExp(`${req.query.search_term}`, "i")
            }
        },
        {
            $count: "total"
        },

    ])
    res.send({
        meta: {
            total: jobs_count[0]?.total,
            page,
            per_page
        },
        data: jobs,
    })
}

const getalljobs = async (req, res, next) => {
    let jobs = await Jobs.aggregate([
        {
            $match: {
                title: RegExp(`${req.query.search_term}`, "i")
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "created_by"
            }
        },
        {
            $unwind: "$created_by"
        },
        {
            $project: {
                "created_by.password": 0
            }
        },
    ])
    res.send({
        data: jobs,
    })
}

const getjobbyid = async (req, res, next) => {
    try {
        let jobs = await Jobs.findById(req.params.id)
        res.send(jobs)
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    getjobs,
    getalljobs,
    getjobbyid,
    putjob,
    deletejob,
    postjobs
}

