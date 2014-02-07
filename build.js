({
    baseUrl: './src',
    // dir: './dist',
    out: './src/streams-built.js',
    name: 'streams',
    // modules: [
    //     {
    //         name: 'streams'
    //     }
    // ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        react: '../bower_components/react/react',
        components: './components',
    }
})