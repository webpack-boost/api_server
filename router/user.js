const express = require('express')
const expressJoi = require('@escook/express-joi')

const router = express.Router()
const userHandler = require('../router_handler/user')
// 导入验证数据的中间件

// 导入验证规则
const { reg_login_schema } = require('../schema/user')

// 配置局部中间件
router.post('/register', expressJoi(reg_login_schema), userHandler.userRegister)

router.post('/login', expressJoi(reg_login_schema), userHandler.userLogin)

module.exports = router
