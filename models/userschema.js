const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
  username:{
    type:String,
    },
email:{
  type:String,
  required:[true,'Email address is required'],
},
token: { type: String },
password:{
  type:String,
  require:[true,'password is required '],
  unique:true
},
created:{
  type:String,
  default:Date
}

 });

 userSchema.pre("save",async function(){
  this.password = await bcrypt.hash(this.password, 12);
 })
module.exports = model('User', userSchema);