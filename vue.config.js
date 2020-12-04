module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
          config
            .entry('app')
            .clear()
            .add('./src/main-prod.js')
          //需要压缩的依赖
          config.set('externals', {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            axios: 'axios',
            lodash: '_',
            echarts: 'echarts',
            nprogress: 'NProgress',
            'vue-quill-editor': 'VueQuillEditor'
          })
          //index.html 可以根据isprod的值来决定如何渲染页面，true发布模式，false开发者模式
          config.plugin('html').tap(args => {
            args[0].isProd = true
            return args
          })
        })
    
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
          config
            .entry('app')
            .clear()
            .add('./src/main-dev.js')
    
          config.plugin('html').tap(args => {
            args[0].isProd = false
            return args
          })
        })
      }

}