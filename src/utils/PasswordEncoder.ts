const bcrypt = require('bcryptjs');

/**
 * 加密。加上前缀{bcrypt}，为了兼容多种加密算法，这里暂时只实现bcrypt算法
 */
export function encrypt(password) {
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, salt, 64);
  return '{bcrypt}' + hash;
}

/**
 * 解密
 */
export function decrypt(password, hash) {
  if (hash.indexOf('{bcrypt}') === 0) {
    hash = hash.slice(8);
  }
  return bcrypt.compareSync(password, hash);
}
