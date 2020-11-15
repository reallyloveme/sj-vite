const Stream = require('stream')
const path = require('path')
async function readBody(stream) {
    if (stream instanceof Stream) {
        return new Promise((resolve, reject) => {
            let res = ''
            stream.on('data', data => {
                res += data
            })
            stream.on('end', () => {
                resolve(res)
            })
        })
    } else {
        return stream.toString()
    }

}

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

module.exports = {
    readBody,
    resolveVue
}
