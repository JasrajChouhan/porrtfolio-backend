import express from "express";
import { getUser, logOut, signIn, signUp , updateEmail , updateName  , forgetPassword, resetPassword} from "../controllers/user.controller.js";

import isAuthorized from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/signup' , signUp);
router.post('/signin' , signIn);
router.get('/logout' , isAuthorized  ,  logOut);
router.get('/getuser' , isAuthorized , getUser);
router.put('/updateemail/:id' , isAuthorized , updateEmail);
router.put('/updatename/:id' , isAuthorized , updateName);
router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);
export default router ;