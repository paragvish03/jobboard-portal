var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}


var newSchema = new Schema({

  'name': { type: String },
  'email': {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid formated email"
    }
  },
  'password': { type: String },
  'UserType': {
    type: String,
    uppercase:true,
    default: "JOBSEEKER"
  },
  "postedjob":{
    type:[mongoose.SchemaType.ObjectId]
  
  },
  "appliedforjob":{
    type:[mongoose.SchemaType.ObjectId]
  
  },
  "mybucket":{
    type:[mongoose.SchemaType.ObjectId]
  
  },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});



module.exports = mongoose.model('User', newSchema);
