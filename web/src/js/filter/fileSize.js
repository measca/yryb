var fileSize = function (val) {
    if (val) {
        if(val > 1024 * 1024 * 1024 * 1024){
            return (Math.round(val * 100 / (1024 * 1024 * 1024 * 1024)) / 100).toString() + 'TB';
        } else if(val > 1024 * 1024 * 1024){
            return (Math.round(val * 100 / (1024 * 1024 * 1024)) / 100).toString() + 'GB';
        } else if (val > 1024 * 1024) {
            return (Math.round(val * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        } else {
            return (Math.round(val * 100 / 1024) / 100).toString() + 'KB';
        }
    } else {
        return "0KB";
    }
}
export function install(Vue, option) {
    Vue.filter('fileSize', function (val) {
        return fileSize(val);
    });
}
export default fileSize;