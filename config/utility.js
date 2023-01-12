
const showdown = require('showdown')
converter = new showdown.Converter({'simplifiedAutoLink':'true'});
const { convert } = require('html-to-text');


exports.KEY = "itssecretketwith32longsring"
exports.markdown_converter = function(data){
    let userdata = []
    data.forEach(element => {
        let result = converter.makeHtml( element.coverletter);
        let text = convert(result,{
            wordwrap:130
        })
        userdata.push({
"application id":element._id,
            "email": element.email,
            "resume": element.resume,
            "coverletter": text
           


        })
    });
    if(userdata.length>0){
        return userdata
    }
    else  return "No data"
}

exports.objectconverter = function (data) {
    let userdata = []
    data.forEach(element => {
        userdata.push({

            "application received": element.applicants.length,
            "id": element._id,
            "title": element.title,
            "description": element.description,
            "experiencelevel": element.experiencelevel,
            "skills": element.requiredskills
            //  "application received": element.postedjob.length


        })
    });
    return userdata

}


exports.fetchbyexperience = async (data, userNameReq) => {
    let result = []
    data.forEach((element) => {
        if (element.experiencelevel == userNameReq) {
            result.push({
                "id": element._id,
                    "Recruiter Email": element.email,
                    "title": element.title,
                    "description": element.description,
                    "experiencelevel": element.experiencelevel,
                    "skills": element.requiredskills
            })
            console.log(element._id)
        }
    })

    if (result.length === 0) {
        return "No result found"
    }
    else {
        console.log(result)
        return result
    }
}
exports.fetchbyrequiredskills = async (data, userNameReq) => {
    let result = []

    data.forEach((element) => {

        element.requiredskills.forEach((ele) => {
            if (ele == userNameReq) {
                result.push({
                    "id": element._id,
                        "Recruiter Email": element.email,
                        "title": element.title,
                        "description": element.description,
                        "experiencelevel": element.experiencelevel,
                        "skills": element.requiredskills
                })
            }
        })

    })

    if (result.length === 0) {
        return "No result found"
    }
    else {
        console.log(result)
        return result
    }
}

