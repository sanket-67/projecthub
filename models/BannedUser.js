import mongoose, { mongo } from "mongoose";

const BannedEmailSchema = new mongoose.Schema({
email :{
    type :String ,
    required :true,
    unique :true,
}


})

BannedEmailSchema.pre("save", async function (next) {
    try {
      this.email = this.email.toLowerCase()  
next();


    } catch (error) {
        res.status(500).json("there is problem ban email")
    }

}) 



export const BannedEmail = mongoose.model("BannedEmail",BannedEmailSchema)
