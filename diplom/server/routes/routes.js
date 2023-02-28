import {Router} from "express";
import usersRoutes from "./userRoutes.js";
import testRoutes from './testRoutes.js'
import resultRoutes from './resultRoutes.js'
import postsRoutes from './postRoutes.js'
import postChangeRoutes from "./postChangeRoutes.js";
const router = Router()

router.use('/user', usersRoutes)
router.use('/post', postsRoutes)
router.use('/postedit', postChangeRoutes)
router.use('/result', resultRoutes)
router.use('/test', testRoutes)

export default router