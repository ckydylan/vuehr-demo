// 请求转发的代理，通过nodejs转发
let proxyObj = {}
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}

module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        port: 8888,
        proxy: proxyObj
    }
}
