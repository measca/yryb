import {user} from "../helpers/apiUrl.js";
import cookie from '../globalMethod/cookie.js';
import ajax from '../utils/ajax.js';

/**
 * 登录接口
 * @param {obj} data 登录数据
 * @param {function} successCallback 成功后的回调
 * @param {function} errorCallback 失败的回调
 */
export function login (data, successCallback, errorCallback) {
    //对data转换成服务器模型
    var sendData = {
        mail: data
    };
    //发送数据数据
    ajax().create(user.login, sendData).success(function (data) {
        cookie.set("user", sendData.mail);
        if ($.isFunction(successCallback)) {
            successCallback("登录成功");
        }
    }).error(function (stateError) {
        if ($.isFunction(errorCallback)) {
            errorCallback("邮箱不存在");
        }
    }).send();
}