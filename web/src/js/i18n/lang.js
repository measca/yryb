export function install(Vue) {
    Vue.use(require('vue-i18n'));

    Vue.locale("zh", require("./lang/zh.js"));
    Vue.locale("en", require("./lang/en.js"));

    Vue.config.lang = 'zh';
}