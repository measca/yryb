var globalVM = {
    types: [],
    states: []
};

export function install(Vue) {
    Vue.global = globalVM;
    Vue.mixin({
        created: function () {
            Vue.util.defineReactive(this, '$global', globalVM)
        }
    })
}
export default globalVM;