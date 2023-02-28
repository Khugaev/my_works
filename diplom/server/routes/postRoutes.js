import express from "express"
import {createPost, deletePost, getPost, getPostTitles, updatePost} from "../controllers/postController.js";
const router = express.Router()
import {isAdmin} from "../middleware/authMiddleware.js";
import commentRoutes from "./commentRoutes.js";

router.use('/comments', commentRoutes)
router.post('/', isAdmin, createPost)
router.delete('/', isAdmin, deletePost)
router.put('/', isAdmin, updatePost)
router.get('/:id', getPost)
router.get('/', getPostTitles)

export default router