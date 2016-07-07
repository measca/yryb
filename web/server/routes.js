/*
* @Author: dmyang
* @Date:   2015-07-31 11:41:38
* @Last Modified by:   dmyang
* @Last Modified time: 2016-03-17 19:23:10
*/

'use strict';

const fs = require('fs');

const render = require('koa-ejs');
const proxy = require('koa-proxy');

let path = require('path')
let glob = require('glob')
let mockDir = path.resolve(process.cwd(), 'mock')
let mockGetFiles = (function(){
    let files = glob.sync(mockDir + '/get/*.js')
    let map = {}
    files.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })
    return map
})();
let mockPostFiles = (function(){
    let files = glob.sync(mockDir + '/post/*.js')
    let map = {}
    files.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })
    return map
})();
let mockGetNames = Object.keys(mockGetFiles)
let mockPostNames = Object.keys(mockPostFiles)

const list = [];

module.exports = (router, app, staticDir) => {

    mockGetNames.forEach(function(name) {
        let data = require('../mock/get/' + name);
        router.get('/api/' + name, function*() {
            data(this);
        });
    });

    mockPostNames.forEach(function(name) {
        let data = require('../mock/post/' + name);
        router.post('/api/' + name, function*() {
            data(this);
        });
    });

    render(app, {
        root: __dirname,
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });

    router.get('/', function*() {
        let pages = fs.readdirSync(staticDir);

        pages = pages.filter((page) => {
            return /\.html$/.test(page);
        });

        yield this.render('home', {pages: pages || []});
    });
};
