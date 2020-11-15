#! /usr/bin/env node

// 需要通过http启动一个模块 koa

const createServer = require('../index.js')
// 创建koa服务

createServer().listen(3000, () => {
    console.log('server start 3000 port', 'http://localhost:3000')
})