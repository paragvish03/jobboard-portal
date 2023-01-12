const jwt = require("jsonwebtoken")
const { KEY } = require("../config/utility")



exports.checktoken = async function (req, res, next) {
    let token = req.headers['jwt_token']

    try {
        if (token) {
            jwt.verify(token, KEY, function (err, decoded) {
                if (err) {
                    res.send({ message: "session expired please sigin again" })
                } else {
                    req.usertype = decoded.usertype
                    req.useremail = decoded.useremail
                
                    console.log(req.usertype, req.useremail )
                    next()
                }
            })

        } else {
            res.send({ message: " please sigin " })
        }
    } catch (error) {
        res.send({ message: error.message })
    }

}

exports.checkRecruiter = async function (req, res, next) {

let isRecuriter= req.usertype

try {
if(isRecuriter == 'RECRUITER'){
    next()
}else{
    res.send({message:"Only Recruiter authorised"})
return;
}

} catch (error) {
    res.send(error.message)
    return;
}
}
exports.checkJobseeker = async function (req, res, next) {

let isJobseeker= req.usertype

try {
if(isJobseeker == 'JOBSEEKER'){
    next()
}else{
    res.send({message:"Only Jobseeker authorised"})
return;
}

} catch (error) {
    res.send(error.message)
    return;
}
}
