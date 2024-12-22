import dotenv from 'dotenv';
import mongoose from 'mongoose'
dotenv.config()
const mongoCon= async() =>{

try {

await mongoose.connect(process.env.MURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log("The database Conneted Sucessfully");




    
} catch (error) {

console.log("There is problem to connnect the mongodb!!!!!",error);
    
}

}
export {mongoCon}