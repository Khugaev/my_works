import express from "express";
import {authUser, changeRole, deleteUser, getAllUsers, registerUser} from "../controllers/userController.js";
import {isAdmin} from "../middleware/authMiddleware.js";
const router = express.Router()

router.post('/', registerUser)
router.post('/login', authUser)
router.get('/', isAdmin, getAllUsers)
router.put('/change_role', isAdmin, changeRole)
router.delete('/', isAdmin, deleteUser)

export default router