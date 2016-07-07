import {share} from "../helpers/apiUrl.js";
import ajax from '../utils/ajax.js';

export function types(successCallback, errorCallback) {
    ajax().create(share.type).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback(data);
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("获取项目类型失败");
        }
    }).send();
}

export function states(successCallback, errorCallback){
    ajax().create(share.state).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback(data);
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("获取项目状态失败");
        }
    }).send();
}