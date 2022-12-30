// 导入加密模块
const bcrypt = require('bcryptjs')
// 导入jsonwebtoken生成token字符串
const jwt = require('jsonwebtoken')
// 导入jwt配置文件
const config = require('../config')
const db = require('../db/index')

/**
 * 用户注册路由的处理函数
 * @param {*} req
 * @param {*} res
 */

exports.userRegister = (req, res) => {
  const { body } = req.body
  console.log(req.body)
  // 判断客户端是否合法，局部中间件expressJoi处理

  // 查找数据库中是否已有用户存在
  const sqlStr = `select username from ev_users where username = '${body.username}'`
  db.query(sqlStr, (err, resp) => {
    if (err) {
      res.errorHandler(err, 500)
      return
    }
    if (resp.length > 0) {
      res.errorHandler('用户已存在')
    } else {
      // 对密码进行加密处理
      body.password = bcrypt.hashSync(body.password, 10)
      // 向数据库插入一条数据
      const sql = `insert into ev_users (username, password) values ('${body.username}', '${body.password}')`
      db.query(sql, (error, result) => {
        if (error) {
          res.errorHandler(error, 500)
          return
        }
        // 如果执行的是insert语句，res是一个对象，res.affectedRows === 1 代表插入成功
        if (result.affectedRows !== 1) {
          res.errorHandler('注册失败')
          return
        }
        res.send({
          code: 1,
          message: '注册成功！'
        })
      })
    }
  })
}

exports.userLogin = (req, res) => {
  const { body } = req.body

  // 检查用户名或密码是否合法，局部中间件expressJoi处理

  // 数据库身份校验
  const sql = `select * from ev_users where username='${body.username}'`

  db.query(sql, (err, result) => {
    // 执行语句失败
    if (err) {
      res.errorHandler(err)
      return
    }
    // 执行语句成功，但是获取的条数不等于1
    if (result.length !== 1) {
      res.errorHandler('登录失败')
      return
    }

    // 比较用户名密码是否与数据库中一致，bcrypt.compareSync(用户提交的密码，数据库存储的密码)
    const passwordCompareRes = bcrypt.compareSync(body.password, result[0].password)
    // 密码不一致
    if (!passwordCompareRes) {
      res.errorHandler('密码错误！')
      return
    }

    // 获取用户信息，剔除密码及头像
    const user = { ...result[0], password: '', avatar: '' }

    // 对用户的信息进行加密，生成一个token字符串
    const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })

    // 响应token给客户端
    res.send({
      code: 0,
      data: {
        token: `Bearer ${token}`
      },
      message: `欢迎您, ${body.username}`
    })
  })
}
