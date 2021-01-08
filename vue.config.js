module.exports = {
    lintOnSave: true,
    devServer: {
        proxy: {
            '/configuration': {
                target: 'http://139.9.240.106',
                // target: 'http://192.168.0.38:13000',
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