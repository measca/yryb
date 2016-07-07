
var routerMap = require("./router-url.js");
var VueRouter = require("../js/lib/vueRouter/vue-router.js");

module.exports = function () {
    var router = new VueRouter();
    router.map(routerMap);
    //验证拦截
    // router.beforeEach(function (transition) {
    //     //判断是否已经登录
    //     if (transition.to.path != "/401" && !globalVal.user()) {
    //         // transition.abort();
    //         transition.redirect("401");
    //     } else if (!transition.to.matched || !transition.to.matched.length) { //判断页面是否存在
    //         transition.redirect("404");
    //     } else {
    //         transition.next()
    //     }
    // });
    return router;
}