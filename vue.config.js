module.exports = {
    lintOnSave: true,

    devServer: {
        proxy: {
            '/api': {
                target: 'http://139.9.240.106',
                ws: true,
                changeOrigin: true
            }
        },
    },
    publicPath: './',
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: true,
    productionSourceMap: undefined,
    parallel: undefined,
    css: undefined
}