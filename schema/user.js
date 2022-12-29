const Joi = require('joi')

/**
 * string 代表是字符串
 * alphanum 代表是a-z A-Z 0-9的字符
 * min 代表最小长度
 * max 代表最大长度
 * required 代表必填项
 * pattern 代表用哪种正则表达式验证
 * ref('x') 与x的值保持一致
 * not(y) 不能和y值保持一致
 * concat(z) 合并z的验证规则
 */

// 定义用户名的验证规则
const username = Joi.string().alphanum().min(1).max(16).required()

// 定义用户密码的验证规则
const password = Joi.string()
  .pattern(/^[\S]{6,12}$/)
  .required()

// 定义用户ID的验证规则
const id = Joi.number().integer().min(1).required()

// 定义用户昵称的验证规则
const nickname = Joi.string().min(2).max(20)

// 定义邮箱的验证规则
const email = Joi.string().email().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    username,
    password
  }
}

// 定义更新用户的规则对象
exports.update_user_schema = {
  body: {
    id,
    username,
    nickname,
    email
  }
}

exports.reset_password_schema = {
  body: {
    oldPwd: password, // 原密码
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password) // 新密码
  }
}

exports.delete_user_schema = {
  params: {
    id
  }
}
