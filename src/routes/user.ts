import { Router } from 'express'
import * as userController from '../controllers/userController'

const router = Router()
router.post('/create', userController.create)
//router.get('/update')
//router.get('/read')

//router.get('/payment/pin')
//router.get('/payment/create')
//router.get('/payment/delete')

export default router
