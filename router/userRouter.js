const router = require('express').Router()
//middleware
const { checktoken, checkRecruiter,checkJobseeker } = require('../middlware/auth')
// controller modules function
const { signup_fx,signin_fx } = require('../controller/UserCtr')
const {userjob_search, applyfor_job, appliedforjob_details, appliedforjob_modify } = require('../controller/UserCtr')
const {createpost, postedjob,postedjob_modify } = require('../controller/UserCtr')


//USER AUTHENTIACTION API's
router.post('/user/signup', signup_fx)   //for new user 
router.post('/user/signin', signin_fx)  //for login part of user


//USER AS JOBSEEKER
router.get('/user/jobs', [checktoken,checkJobseeker], userjob_search)          //user get all the jobs and to filter use query parameters
router.post('/user/jobs', [checktoken,checkJobseeker],applyfor_job )          //user get can apply for jobs by providing id of postedjob 
router.get('/user/appliedjobs', [checktoken,checkJobseeker], appliedforjob_details)   //user get all history for applied jobs on his bucket 
router.put('/user/appliedjobs', [checktoken,checkJobseeker],appliedforjob_modify )   //user can delete and edit his application


//USER AS RECRUITER
router.post('/create-jobpost', [checktoken, checkRecruiter], createpost)    //recruiter can create for new job post 
router.get('/postedjob', [checktoken, checkRecruiter],        postedjob)            //recruiter can see past posted job with no. of application recieved 
router.put('/postedjob', [checktoken, checkRecruiter], postedjob_modify)    //recruiter can delete or edit jobpost if required





module.exports = {
    UserRouter: router
}