const clk = require('cli-color')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserJobposting = require('../models/UserJobposting')
const UserApplication = require('../models/UserApplication')
const { KEY, objectconverter, fetchbyexperience, fetchbyrequiredskills, markdown_converter } = require('../config/utility')


exports.signup_fx = async (req, res) => {
    const details = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        UserType: req.body.UserType,
    }
    try {
        let result = await User.create(details)
        res.send({
            "message": "user created successful",
            "name": result.name,
            "email": result.email,
            "usertype": result.UserType
        }

        )

    } catch (error) {
        res.send({ message: error.message })
    }
}
exports.signin_fx = async (req, res) => {
    const details = {
        email: req.body.email,
        password: req.body.password
    }
    try {

        let user = await User.findOne({ email: details.email })
        if (user) {
            let validpassword = bcrypt.compareSync(details.password, user.password)
            if (validpassword) {
                console.log("<>>>>>><<<<" + user.UserType)
                let token = jwt.sign({ usertype: user.UserType, useremail: user.email }, KEY, { expiresIn: "1d" })
                console.log(clk.yellow(token))
                res.send({ message: "login successful !", "jwt_token": token })
            }
            else {
                res.send({ message: "invalid credential" })
            }

        } else {
            res.send({ message: "invalid user email" })
        }


    } catch (error) {
        res.send({ message: error.message })
    }


}






//USER AS JOBSEEKER
exports.userjob_search = async (req, res) => {
    let pages = req.query.pages || 1
    let limits = req.query.limits || 5
    let id = req.query.id
    let experience = req.query.experience
    let requiredskills = req.query.requiredskills
    try {

        if (id ) {
            let result = await UserJobposting.findById(id)
            res.status(200).send({
                "id": result._id,
                "Recruiter Email": result.email,
                "title": result.title,
                "description": result.description,
                "experiencelevel": result.experiencelevel,
                "skills": result.requiredskills
            
            })
        return;

    } else {
        let total_post = await UserJobposting.find()
        let result = await UserJobposting.find().skip((pages - 1) * limits).limit(limits)

        if (experience) {
            let array = await fetchbyexperience(result, experience)
            //  console.log(experience, "arr", array)
            res.status(200).send(array)
            return;
        }
        else if (requiredskills) {
            let array = await fetchbyrequiredskills(result, requiredskills)
            console.log(experience, "arr", array)
            res.send(array)
            return;
        }

        res.status(200).send(({ page: pages, limit: limits, total: total_post.length, "result": result }))
        return;

    }
} catch (error) {
    res.status(500).send({ message: error.message })
}



}
exports.applyfor_job = async (req, res) => {
    let id = req.query.id

    let applyforjob = {
        name: req.bodyname,
        resume: req.body.resume,
        coverletter: req.body.coverletter
    }
    try {
        // is user already applied
        let check_submition = await User.findOne({ email: req.useremail })

        let cheCk = check_submition["appliedforjob"].indexOf(id)
        if (cheCk > -1) {
            res.status(201).send({ message: "ALREADY APPLIED FOR THIS JOB" })
            return;
        }



        applyforjob["email"] = req.useremail
        let result = await UserApplication.create(applyforjob)

        let setid = await UserJobposting.findOne({ _id: id })
        await setid.applicants.push(result._id)
        setid.save()
        console.log(">>>>>><<<<<<", setid)

        let user_appliedjob = await User.findOne({ email: req.useremail })
        await user_appliedjob.appliedforjob.push(id)
        await user_appliedjob.mybucket.push(result._id)
        user_appliedjob.save()




        res.send({ message: `applied for job successfully for ${id}` })
    } catch (error) {
        res.send({ message: error.message })
    }

}
exports.appliedforjob_details = async (req, res) => {

    try {
        let result = await User.findOne({ email: req.useremail })
        console.log(result.mybucket.length)
        if (result.mybucket.length > 0) {
            let arr = []
            let arr1 = result.mybucket
            arr1.forEach((element) => {
                arr.push(element)
            })
            console.log(arr)
            const applied_DATA = await UserApplication.find({ _id: arr })
            console.log(applied_DATA)
            res.status(200).send({ "total applied": result.mybucket.length, "result": markdown_converter(applied_DATA) })


        } else {
            res.status(200).send({ message: " not applied for any job yet" })
        }


    } catch (error) {
        res.status(200).send({ message: error.message })
    }


}
exports.appliedforjob_modify = async (req, res) => {
    let id = req.query.id
    let edit = req.query.edit
    let Delete = req.query.Delete

    try {
        let result = await UserApplication.findOne({ _id: id })
        console.log(result)
        if (result) {
            if (edit = "true") {
                Object.assign(result, req.body)
                await result.save()
                res.status(200).send({ message: "updated successfully", "result": req.body })
                return;
            }


            let arr = []
            let arr1 = result.mybucket
            arr1.forEach((element) => {
                arr.push(element)
            })
            console.log(arr)
            const applied_DATA = await UserApplication.find({ _id: arr })
            console.log(applied_DATA)
            res.status(200).send({ "total applied": result.mybucket.length, "result": markdown_converter(applied_DATA) })

        } else {
            res.status(200).send({ message: " invalid id" })
        }


    } catch (error) {
        res.status(200).send({ message: error.message })
    }


}



//USER AS RECRUITER
exports.createpost = async (req, res) => {
    let postingdetails = {
        title: req.body.title,
        description: req.body.description,
        requiredskills: req.body.requiredskills,
        experiencelevel: req.body.experiencelevel,
    }

    try {
        postingdetails["email"] = req.useremail  //from token  email getting automatically
        let result = await UserJobposting.create(postingdetails)
        let result2 = await User.findOne({ email: req.useremail })

        result2["postedjob"].push(result.id)
        await result2.save()

        res.send({
            message: "job posted successfully",
            _id: result.id,
            recruiter_Email: result.email,
            title: result.title,
            description: result.description,
            requiredskills: result.requiredskills,
            experiencelevel: result.experiencelevel,
        })

    } catch (error) {
        res.send({ message: error.message })
    }


}
exports.postedjob = async (req, res) => {
    let pages = req.query.pages || 1
    let limits = req.query.limits || 5
    let id = req.query.id

    try {
        if (id) {
            let result = await UserJobposting.findOne({ _id: id })
            console.log(result.applicants)
            if (!result) {
                res.send({ message: "invalid id" })
                return;
            }
            let arr = []
            let arr1 = result.applicants
            arr1.forEach((element) => {
                arr.push(element)
            })

            const DATA = await UserApplication.find({ _id: arr }).skip((pages - 1) * limits).limit(limits)
            console.log(DATA)
            res.status(200).send({
                "pages": pages, "limits": limits, "total": arr.length, "result": markdown_converter(DATA)
            })

        }

        else {
            let result = await User.findOne({ email: req.useremail })
            if (result) {
                let arr = []
                let arr1 = result.postedjob
                console.log(arr1)
                arr1.forEach((element) => {
                    arr.push(element)

                })

                const DATA = await UserJobposting.find({ _id: arr }).skip((pages - 1) * limits).limit(limits)
                console.log(typeof (result.postedjob), DATA)
                res.status(200).send({ "pages": pages, "limits": limits, "total": arr.length, "result": objectconverter(DATA) })
                return;

            } else {
                res.send({ message: "problem persist while email checkin" })
            }


        }
    } catch (error) {
        res.send({ message: error.message })
    }



}
exports.postedjob_modify = async (req, res) => {
    let Delete = req.query.Delete || false
    let edit = req.query.edit || false

    try {
        if (id && Delete == "true") {
            let result = await UserJobposting.findOneAndDelete({ _id: id })
            if (result) {
                console.log("deleteeee", result, req.query)
                res.status(200).send({ message: `${id}job post deldeted successfully` })
            } else {
                res.status(200).send({ message: `${id} invalid id` })
            }

        }
        else if (id && edit == "true") {
            let result = await UserJobposting.findOne({ _id: id })
            Object.assign(result, req.body)
            await result.save()
            res.status(200).send(result)
        }
        else {
            res.status(200).send({ message: "invalid id / operation" })
        }

    } catch (error) {
        res.status(400).send({ message: "invalid id / operation" })
    }

}