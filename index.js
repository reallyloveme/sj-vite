const Koa = require('koa')

const {serveStaticPlugin} = require('./plugins/serverPluginServeStatic')
const { moduleRewritePlugin} = require('./plugins/serverPluginModuleRewrite')
const { moduleResolvePlugin} = require('./plugins/serverPluginModuleResolve')
const {htmlRewritePlugin} = require('./plugins/serverPluginHtmlRewrite')
const {vuePlugin} = require('./plugins/serverPluginVue')

function createServer() {
    const app = new Koa()

    const root = process.cwd() // 当前命令运行的目录
    console.log(root)

    const context = {
        app,
        root
    }
    // 创建服务
    const resolvedPlugins = [ // 插件集合
        htmlRewritePlugin,
        // 2.解析import 重写路径
        moduleRewritePlugin,
        // 3.解析@modules文件考题的内容，找到对应结果
        moduleResolvePlugin,
        vuePlugin,
        // 1.实现静态服务功能
        serveStaticPlugin
    ]
    resolvedPlugins.forEach(plugin => plugin(context))
    return app
}

module.exports = createServer