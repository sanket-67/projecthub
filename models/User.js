import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const UserSchema =  new mongoose.Schema({
username :{
    type:String ,
    unique:true,
    trim : true,
    index:true,
    required : true,
    lowercase :true
},
email:{
type : String ,
trim : true,
required : true,
lowercase :true, 
unique : true 

},
fullname :{
    type : String ,
    trim : true,
    index : true,
required : true,

},
Watchhistory :[{
type:mongoose.Schema.Types.ObjectId,
ref:'Video'
}]
,
password:{
    type: String ,
    required:true,
},
refreshtoken:{
    type:String
},

userRole: {
    type: String,
    enum: ['admin', 'user'], // Only allow 'admin' or 'user' as values
    default: 'user', // Default to 'user'
  },

useridcard :{
    type : String ,
    required : true 
}  ,

isAllowed :{
type :Boolean,
default:false
},

isBanned : {
    type:Boolean,
    default:false
},

skills : {
    type:[String],
}

},{timestamps:true})
// whle using pre dont use arrow function it dont have the permission of password or any filed

UserSchema.pre('save',async function (next){
if(!this.isModified('password')){
next();

}
 this.password = await bcrypt.hash(this.password,10)
next();

})

UserSchema.methods.ispasswordCorrect = async function (password){

return await bcrypt.compare(password,this.password)

}

UserSchema.methods.genrateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
        userRole: this.userRole,
    }, process.env.ACCESS_SECRET, {
        expiresIn: '1h'
    });
}


UserSchema.methods.genrateRefreshToken = async function () {
    try {
        return await jwt.sign({
            _id: this._id,
            userRole: this.userRole,
            isAllowed : this.isAllowed,
        }, process.env.REFRESH_SECRET, {
            expiresIn: '7d'
        });
    } catch (error) {
        throw new Error('Failed to generate refresh token: ' + error.message);
    }
}
    


export const User= mongoose.model('User',UserSchema)
