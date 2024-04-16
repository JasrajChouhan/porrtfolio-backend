import express from 'express'
import {getInfoOfRecuriter} from '../controllers/contactUs.controller.js'
import isAuthorized from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/' , getInfoOfRecuriter)

export default router;