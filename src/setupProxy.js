const { createProxyMiddleware } = require("http-proxy-middleware");

const target = "http://localhost:7700";

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: target,
            changeOrigin: true,
            pathRewrite: { "^/api": "/api" },
        })
    );
};
