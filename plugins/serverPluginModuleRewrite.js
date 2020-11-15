const { readBody } = require('./utils')
const {parse} = require('es-module-lexer')
const MagicString = require('magic-string')

function rewriteImports(source) {
    let imports = parse(source)[0]
    let magicString = new MagicString(source)

    // console.log(imports)
    if (imports.length) {
        for (let i = 0; i < imports.length; i++) {
            let {s, e} = imports[i]
            let id = source.substring(s, e)
            // 当前开头是\ 或者. 不需要重写
            if (/^[^\/\.]/.test(id)) {
                id = `/@modules/${id}`
                magicString.overwrite(s,e,id)
            }
        }
    }
    return magicString.toString()
}

function moduleRewritePlugin({app, root}) {
    app.use(async (ctx, next) => {
        await next()
        if (ctx.body && ctx.response.is('js')) {
            // 获取文件流
            let content = await readBody(ctx.body)
            const result = rewriteImports(content)
            ctx.body = result
        }
        
    })
}

exports.moduleRewritePlugin = moduleRewritePlugin