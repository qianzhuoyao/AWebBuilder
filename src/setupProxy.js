const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(createProxyMiddleware('/mwapi', {
        target: 'http://10.180.5.186:30095',
        changeOrigin: true,
        pathRewrite: { '^/mwapi': '/mwapi' },
    })
    )
}