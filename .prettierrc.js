module.exports = {
  ...require('mwts/.prettierrc.json'),
  endOfLine: "lf",        // 换行符使用 lf
  printWidth: 120,        // 一行最多 120 字符
  proseWrap: "preserve",  // 使用默认的折行标准
  semi: true,             // 行尾需要有分号
}
