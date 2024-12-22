import mongoose from "mongoose";


const ProjectInfoSchema = new mongoose.Schema({
projectname :{
    type :String ,
    required : true,
    trim:true,
},

description :{
    type :String ,
    required : true,
    trim:true,
}
,
Userid :{
    type:mongoose.Types.ObjectId,
    ref : "User"
},

skill:{
    type:[],
    required:true
},
duration:{
    type: Number 
    ,
    default:0
},
teamsize:{
type:Number,
default:0
},
modeofwork:{
    type:String,
}
  
});





export const ProjectInfo = mongoose.model("ProjectInfo",ProjectInfoSchema)