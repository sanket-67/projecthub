import e from "express";

import {registerUser,loginUser,getpendingusers,grantUser,bannedUser,logout,gettoken} from '../controllers/usercontollers.js'
import { upload } from "../middlewares/multer.js";
import {Adminverify} from '../middlewares/admin.js'
import {verifyJWT} from '../middlewares/VerifyJWT.js'
const router = e.Router()

router.route("/register").post(upload.single('useridcard'),registerUser)
router.route("/login").post(loginUser)
router.route("/admin").post(Adminverify, (req,res)=>{

    res.status(200).json({ success: true, message: "Welcome to the admin panel" });

})
router.route("/pendingreq").get(Adminverify,getpendingusers)
router.route("/grantuser").post(Adminverify,grantUser)
router.route("/bannedUser").post(Adminverify,bannedUser)
router.route("/logout").post(verifyJWT,logout)
router.route("/gettoken").post(verifyJWT, gettoken);

export default router
