//requiure modules
require('./config/db.config')
const clk = require('cli-color')
const express = require('express')
const app = express()
const {UserRouter} = require('./router/userRouter')


//middleware use
app.use(express.json())
app.use('/app/job-board',UserRouter)


//homepage
app.get('/', (req,res)=>{
    res.send({message:"Homepage JOB-BOARD "})
})



//server configuration
app.listen(5050, async(req,res)=>{
   console.log(clk.bgBlackBright('server connected on=> http://localhost:5050'))
})