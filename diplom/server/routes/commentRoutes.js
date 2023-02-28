import express from "express"
import {protect} from "../middleware/authMiddleware.js";
import {deleteComment, getComments, saveComment, updateComment} from "../controllers/commentController.js";
const router = express.Router()

router.post('/', protect, saveComment)
router.put('/', protect, updateComment)
router.delete('/', protect, deleteComment)
router.get('/', getComments)

export default router