import express from "express"
const router = express.Router()
import {
  getAllChanges, getChange, getChangeAdmin,
  suggestChange,
  updateChangeOfPosts
} from "../controllers/postChangeController.js";
import {isAdmin, protect} from "../middleware/authMiddleware.js";

router.post('/', protect, suggestChange)
router.get('/:postId', protect, getChange)
router.get('/:postId/:userId', isAdmin, getChangeAdmin)
router.get('/', isAdmin, getAllChanges)
router.put('/:postId', protect, updateChangeOfPosts)

export default router