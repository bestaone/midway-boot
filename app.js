const WebFramework = require('@midwayjs/koa').Framework;
const { Bootstrap } = require('@midwayjs/bootstrap');

/**
 * serverless 部署是需要 添加此启动文件
 */
module.exports = async () => {
  console.log('启动服务');
  // 加载框架并执行
  await Bootstrap.run();
  // 获取依赖注入容器
  const container = Bootstrap.getApplicationContext();
  // 获取 koa framework
  const framework = container.get(WebFramework);
  // 返回 app 对象
  return framework.getApplication();
};
