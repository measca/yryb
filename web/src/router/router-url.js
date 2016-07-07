module.exports = {
  // "/": {
  //   component: function (resolve) {
  //     require(['./view/index/index.vue'], resolve)
  //   }
  // },
  // "project":{
  //   component: function (resolve) {
  //     require(['./view/porject/index.vue'], resolve)
  //   },
  //   subRoutes: {
  //     "/": {
  //       component: function (resolve) {
  //       require(['./view/porject/list.vue'], resolve)
  //       }
  //     },
  //     "add":{
  //       component: function (resolve) {
  //         require(["./view/porject/add.vue"], resolve);
  //       }
  //     }
  //   }
  // },
  //页面状态码配置
  "401": {
    component: function (resolve) {
      require(['./state/401.vue'], resolve);
    }
  },
  "404": {
    component: function (resolve) {
      require(['./state/404.vue'], resolve);
    }
  }
}