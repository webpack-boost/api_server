const express = require('express')
const expressJoi = require('@escook/express-joi')
const router = express.Router()
const {
  getUserInfo,
  resetPassword,
  updateBaseInfo,
  deleteUser
} = require('../router_handler/userInfo')
const {
  update_user_schema,
  reset_password_schema,
  delete_user_schema
} = require('../schema/user')

router.get("/userInfo", getUserInfo)

router.put('/userInfo', expressJoi(update_user_schema),updateBaseInfo)

router.put('/reset/pwd', expressJoi(reset_password_schema), resetPassword)

router.delete('/delete/:id', expressJoi(delete_user_schema), deleteUser)

module.exports = router
