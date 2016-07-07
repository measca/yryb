require("../../style/sass/style.scss");
require("../../style/font/css/font-awesome.css");

Vue.config.silent = true;

Vue.use(require('vue-resource'));
Vue.use(require('vue-async-data'));
Vue.use(require("vuex"));
Vue.use(require("../directive/datetime.js"));
Vue.use(require("../filter/fileSize.js"));
Vue.use(require("../filter/datetime.js"));
Vue.use(require("../globalMethod/JSON.js"));
Vue.use(require("../globalMethod/cookie.js"));
Vue.use(require("../globalMethod/storeData.js"));
Vue.use(require("../globalMethod/global.js"));
Vue.use(require("../globalMethod/title.js"));
Vue.use(require("../directive/validation/validation.js"));
Vue.use(require("../i18n/lang.js"));
Vue.use(require("../directive/tooltip.js"));
Vue.use(require("../directive/popover.js"));
Vue.use(require("../directive/alert.js"));