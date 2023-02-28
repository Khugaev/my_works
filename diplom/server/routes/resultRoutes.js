import {Router} from 'express'
const router = Router()
import {getResults, getResult, updateResult} from "../controllers/resultController.js"
import {isAdmin, protect} from "../middleware/authMiddleware.js"
import {updatePost} from "../controllers/postController.js"

router.get('/', protect, getResults)
router.get('/:id', protect, getResult)
router.put('/:id', protect, updateResult)

export default router