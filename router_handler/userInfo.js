// 导入加密模块
const bcrypt = require('bcryptjs')
const db = require('../db/index')

const isUserExists = (id, message, res, cb) => {
  const sql = 'select * from ev_users where id = ?'
  db.query(sql, id, (err, result) => {
    if (err) {
      res.errorHandler(err)
      return
    }
    if (result.length !== 1) {
      res.errorHandler(message)
      return
    }
    cb()
  })
}

/**
 * 根据id查询用户基本信息
 * @param {*} req
 * @param {*} res
 */
exports.getUserInfo = (req, res) => {
  const sql = 'select id, username, nickname, email, avatar from ev_users where id = ?'
  db.query(sql, req.user.id, (err, result) => {
    if (err) {
      res.errorHandler(err)
      return
    }
    // 执行语句成功，但长度不为1
    if (result.length !== 1) {
      res.errorHandler('获取用户信息失败')
      return
    }
    res.send({
      code: 1,
      message: '操作成功',
      data: result[0]
    })
  })
}

/**
 * 重置密码
 * @param {*} oldPwd
 * @param {*} newPwd
 * @param {*} originalPwd
 * @param {*} userId
 * @param {*} res
 * @returns
 */
exports.resetPassword = (req, res) => {
  // 根据id查询数据库表是否有该用户
  const sqlStr = 'select * from ev_users where id = ?'
  db.query(sqlStr, req.user.id, (err, resp) => {
    if (err) {
      res.errorHandler(err)
      return
    }
    if (resp.length !== 1) {
      res.errorHandler('用户不存在')
      return
    }
    const passwordCompareRes = bcrypt.compareSync(req.body.oldPwd, resp[0].password)
    if (!passwordCompareRes) {
      res.errorHandler('原密码错误')
      return
    }
    const pwd = bcrypt.hashSync(req.body.newPwd, 10)
    const sql = 'update ev_users set password = ? where id = ?'
    db.query(sql, [pwd, req.user.id], (error, result) => {
      if (error) {
        res.errorHandler(error)
        return
      }
      if (result.affectedRows !== 1) {
        res.errorHandler('密码重置失败')
        return
      }
      res.send({
        code: 1,
        message: '密码重置成功',
        data: true
      })
    })
  })
}

/**
 * 根据用户id更新除密码外的基本信息
 * @param {*} req
 * @param {*} res
 */
exports.updateBaseInfo = (req, res) => {
  const sql = 'update ev_users set ? where id = ?'
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (err) {
      res.errorHandler(err)
      return
    }
    if (result.affectedRows !== 1) {
      res.errorHandler('更新失败')
      return
    }
    res.send({
      code: 1,
      message: '操作成功',
      data: true
    })
  })
}

/**
 * 根据id删除用户
 * @param {*} req
 * @param {*} res
 */
exports.deleteUser = (req, res) => {
  isUserExists(req.params.id, '用户不存在', res, () => {
    const sql = 'delete from ev_users where id = ?'
    db.query(sql, req.params.id, (err, result) => {
      if (err) {
        res.errorHandler(err)
        return
      }
      if (result.affectedRows !== 1) {
        res.errorHandler('删除失败')
        return
      }
      res.send({
        code: 1,
        message: '操作成功',
        data: true
      })
    })
  })
}
