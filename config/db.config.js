const clk = require('cli-color')
const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/JOB-BOARD'
mongoose.set('strictQuery', true)
mongoose.connect(uri,(err)=>{
    if(err)console.log(err)
    else  console.log(clk.bgMagenta('Database Connected!'))

})