import { Router } from "express";
import * as controller from "../controllers/appController.js";
import Auth,{localVariables} from "../middleware/auth.js";
import {registerMail} from "../controllers/mailer.js"

const router = Router();

/** import controller */

/** POST methods */
router.route("/register").post(controller.register)
router.route("/registerMail").post(registerMail) //send mail
router.route("/authenticate").post(controller.verifyUser,( req, res ) => res.end())
router.route("/login").post(controller.verifyUser, controller.login)

/** GET methods */
router.route("/user/:username").get(controller.getUser)
router.route("/generateOTP").get(controller.verifyUser,localVariables,controller.generateOTP)
router.route("/verifyOTP").get(controller.verifyOTP)
router.route("/createResetSession").get(controller.createResetSession)

/** PUT methods */
router.route("/updateUser").put(Auth, controller.updateUser)
router.route("/resetPassword").put(controller.verifyUser,controller.resetPassword)

export default router