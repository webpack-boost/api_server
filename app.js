/**
 * @description 项目入口文件
 */
const express = require('express')
const cors = require('cors')
const expressJwt = require('express-jwt')
const config = require('./config')

// 导入路由模块
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')

// 导入验证规则
const Joi = require('joi')

const app = express()

// 配置CORS跨域
app.use(cors())
// 配置解析表单数据及JSON数据的中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use((req, res, next) => {
  // 封装处理错误信息的中间件函数
  res.errorHandler = (err, status = 200, code = 0) => {
    res.status(status).send({
      code,
      message: err instanceof Error ? err.message : err // err可能为一个Error对象或者字符串
    })
  }
  next()
})
// 配置解析token的中间件，必须配置在路由前
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 挂载路由
app.use('/api', userRouter)
app.use('/my', userInfoRouter)

// 配置全局错误处理中间件，必须配置在路由模块后
app.use((err, req, res, next) => {
  // 验证失败的错误
  if (err instanceof Joi.ValidationError) {
    // 必须加return，express不允许连续调用res.send方法
    return res.errorHandler(err)
  }
  // 身份认证失败的错误
  if (err.name === 'UnauthorizedError') {
    return res.errorHandler('无效的token', 401, 1)
  }
  // 未知错误
  res.errorHandler(err)
  next()
})

app.listen(3007, () => {
  console.log('server running at http://127.0.0.1:3007')
})
