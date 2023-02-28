import {Router} from 'express'
const router = Router()
import {protect ,isAdmin} from "../middleware/authMiddleware.js"
import {createTest, updateTest} from "../controllers/testController.js"
import {passTest, getTest} from "../controllers/postController.js"

router.post('', isAdmin, createTest)
router.put('/:id', isAdmin, updateTest)
router.post('/:id', protect, passTest)
router.get('/:id', /*protect, */getTest)

export default router



/*
* {
	"questions": {
		"1": {
			"question": "Чему равно произведение шести и семи?",
			"answer" : "42",
			"score" : 1
		},
		"2": {
			"question": "Что делать если оказался в космосе?",
			"answer" : "Не паниковать",
			"score" : 2
		}
	}
}
* */