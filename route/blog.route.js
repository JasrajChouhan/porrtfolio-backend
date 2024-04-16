import express from 'express'
import {allBlogs , postBlog , getOneBlog } from '../controllers/blog.controller.js'
import isAuthorized from '../middlewares/auth.middleware.js'

const router = express.Router();


router.get('/'  ,  allBlogs);
router.post('/'  , postBlog);
router.get('/:id'  ,  getOneBlog);

export default router;