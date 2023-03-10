var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}


var newSchema = new Schema({
  
  'title': { type: String,require:true },
  'email': { type: String,require:true },
  'description': { type: String,require:true},
  'requiredskills': { type: Array ,require:true },
  'experiencelevel': { type: Number },
  "applicants":{
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




module.exports = mongoose.model('UserJobposting', newSchema);
