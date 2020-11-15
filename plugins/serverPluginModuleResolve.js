const moduleREG = /^\/@modules\//

const fs = require('fs')
const path = require('path')

function resolveVue(root) {
    const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json')
    const compilerPkg = require(compilerPkgPath)
    const compilerpath =  path.join(path.dirname(compilerPkgPath), compilerPkg.main)

    const resolvePath = (name) => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)
    const runtimeDomPath = resolvePath('runtime-dom')
    const runtimeCorePath = resolvePath('runtime-core')
    const reactivityPath = resolvePath('reactivity')
    const sharedPath = resolvePath('shared')
    return {
        compiler: compilerpath,
        '@vue/runtime-dome': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        vue: runtimeDomPath
    }
}
function moduleResolvePlugin({app, root}) {
    const vueResolved = resolveVue(root) // 根据当前目录解析文件表
    app.use(async (ctx, next) => {
        if (!moduleREG.test(ctx.path)) {
            return next()
        }

        const id = ctx.path.replace(moduleREG, '')

        ctx.type = 'js' // 设置响应文件结果是js类型

        const content = await fs.readFileSync(vueResolved[id],'utf8')

        ctx.body = content
    })
}

exports.moduleResolvePlugin = moduleResolvePlugin