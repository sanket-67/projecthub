import express, { Router } from 'express'
import { projectdata,applyproject,getAllProjects } from '../controllers/projectcontroller.js';
import { verifyJWT } from '../middlewares/VerifyJWT.js';
const router =  Router();


router.route("/create").post(verifyJWT,projectdata)
router.route("/apply").post(verifyJWT,applyproject)
router.route("/list").get(verifyJWT,getAllProjects)



export{router as projectroute}