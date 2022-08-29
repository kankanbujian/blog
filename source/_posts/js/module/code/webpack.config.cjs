const path = require('path')

browerModule = {
    entry: './esmodule/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' }
        ]

    },
    mode: 'production'
}


nodeModule = {
    entry: './node/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // module: {
    //     rules: [
    //         { test: /\.js$/, use: 'babel-loader' }
    //     ]

    // },
    mode: 'production'
}


// module.exports = browerModule
module.exports = nodeModule
