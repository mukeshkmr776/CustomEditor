const path = require('path');
const NODE_ENV = process.env.NODE_ENV;

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

console.log("   mode:", mode);
console.log("devtool:", devtool);
console.log();


module.exports = {
    entry: './src/server.ts',
    target: 'node',
    mode,
    devtool,
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        __dirname: false,
        __filename: false,
    }
};