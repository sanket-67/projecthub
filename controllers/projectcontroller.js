import asyncHandler from "../utilz/asyncHandler.js";
import ApiError from "../utilz/ApiError.js";
import { ApiResponse } from "../utilz/ApiResponse.js";
import { ProjectInfo } from "../models/ProjectInfo.js";
import { User } from "../models/User.js";
import nodemailer from 'nodemailer'

const projectdata= asyncHandler(async (req,res)=>{
const {projectname,description,skill,duration,teamsize,modeofwork} =req.body;
if ([projectname,description,skill,duration,teamsize,modeofwork].some(item=> !item)) {
 throw new ApiError(400,"enter all the fiileds");   
}

const existingproject = await ProjectInfo.findOne({projectname})

if (existingproject) {
    throw new ApiError(400,"project is already created");
}

const project  = await ProjectInfo.create({
    
     projectname ,
    description ,
        skill,    
        duration ,
        teamsize ,
        modeofwork ,
        Userid :req.user._id

})

console.log(project);

res.status(200).json( new ApiResponse(200,"project created sucessfully",{project}))




})


const applyproject = asyncHandler(async(req,res)=>{
const {projectname} = req.body;

console.log(projectname);

const user = await User.findById(req.user._id);

console.log(user);

const projectdata = await ProjectInfo.findOne({projectname})

if (!projectdata) {
    throw new ApiError(400,"project is not found");
}



const leader = await User.findById(projectdata.Userid)

if (!leader) {
    throw new ApiError(401,"leader is not found ");
}

console.log(leader.email);


const leaderemail = leader.email
const transport =   nodemailer.createTransport({
service :"gmail",
auth :{
    user :process.env.GMAIL_USER,
    pass :process.env.GMAIL_PASS
}
})

const mailoptions = {

    from : "sanketmule67@gmail.com",
    to : leaderemail ,
    subject:"Exciting New Collaboration Request - ProjectHub🔔🔔🔔",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Collaboration Request - ProjectHub</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 20px; text-align: center; background: linear-gradient(135deg, #4a90e2, #63b3ed);">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); transform: perspective(500px) rotateX(10deg);">
                    Project<span style="font-weight: bold;">Hub</span>
                </h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #4a90e2; margin-top: 0;">New Collaboration Request</h2>
                <p>Hello Project Leader,</p>
                <p>Exciting news! A talented individual is interested in collaborating on your project. Here are the details:</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.fullname}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Project:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">"${projectname}"</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; vertical-align: top;"><strong>Skills:</strong></td>
                        <td style="padding: 10px;">
                            ${user.skills.map(skill => `
                                <span style="display: inline-block; background-color: #e1f0ff; color: #4a90e2; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 14px;">
                                    ${skill}
                                </span>
                            `).join('')}
                        </td>
                    </tr>
                </table>
                <p>This could be the perfect opportunity to bring fresh ideas and skills to your project. We encourage you to reach out and explore this potential collaboration!</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="mailto:${user.email}" style="background-color: #4a90e2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; transition: background-color 0.3s;">Contact Collaborator</a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #888;">Connect with ProjectHub</p>
                <div style="margin-top: 10px;">
                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://example.com/facebook-icon.png" alt="Facebook" width="24" height="24"></a>
                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://example.com/twitter-icon.png" alt="Twitter" width="24" height="24"></a>
                    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://example.com/linkedin-icon.png" alt="LinkedIn" width="24" height="24"></a>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
};


 const mailsendsucessfuly = await transport.sendMail(mailoptions,(error,info)=>{
if (error) {
    console.log(error);
    throw new ApiError(400,"problem to mail leader"); 
}

console.log(info.response);

})


res.status(200).json(new ApiResponse(200,"your application is send to leader"))


})
const getAllProjects = asyncHandler(async (req, res) => {
   
  const project = await ProjectInfo.find()
  
 if(!project){
    throw new ApiError(500,"there is some problem to get the project");
 }

 res.status(200).json(new ApiResponse(200,"project data got ", project))
  





  });
  



export {projectdata,applyproject ,getAllProjects}