import {project} from "../helpers/apiUrl.js";
import ajax from '../utils/ajax.js';
import cookie from '../globalMethod/cookie.js';
import JSON from '../globalMethod/JSON.js';

/**
 * 新增项目
 */
export function add(data, successCallback, errorCallback) {
    data = {
        Name: data.name,
        Type: data.type,
        Url: data.url,
        Price: data.price,
        CustomerName: data.customerName,
        CustomerPhone: data.customerPhone,
        Address: data.address,
        StateTitle: data.state,
        StateColor: data.stateColor,
        StateRemarks: data.remarks,
        UserMail: cookie.get("user")
    }
    ajax().create(project.add, {
        datas: JSON.stringify(data)
    }).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback(data, "新增项目成功");
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("新增项目失败");
        }
    }).send();
}

/**
 * 获取项目列表
 */
export function list(data, successCallback, errorCallback) {
    ajax().create(project.list, data).success(function (data) {
        if (typeof successCallback === "function") {
            let datas = [];
            for(let i = 0,tempData;data.datas && (tempData = data.datas[i++]);) {
                datas.push({
                    state: {
                        title: tempData.infoTitle,
                        color: tempData.infoColor,
                        remarks: tempData.infoRemarks
                    },
                    id: tempData.id,
                    address: tempData.address,
                    createTime: tempData.createTime,
                    createUser: tempData.createUser,
                    customerName: tempData.customerName,
                    customerPhone: tempData.customerPhone,
                    name: tempData.name,
                    price: tempData.price,
                    type: tempData.type,
                    url: tempData.url
                });
            }
            data.datas = datas;
            successCallback(data);
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("获取项目列表失败");
        }
    }).send();
}

/**
 * 获取项目状态
 */
export function stateInfo(data, successCallback, errorCallback) {
    ajax().create(project.stateInfo, data).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback(data);
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("获取项目状态失败");
        }
    }).send();
}

/**
 * 设置项目状态
 */
export function setState(data, successCallback, errorCallback) {
    data = {
        ProjectId: data.projectId,
        Title: data.title,
        Color: data.stateColor,
        Remarks: data.remarks,
        UserMail: cookie.get("user")
    }
    ajax().create(project.setState, {
        datas: JSON.stringify(data)
    }).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback("设置项目状态成功");
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("设置项目状态失败");
        }
    }).send();
}

/**
 * 编辑项目
 */
export function edit(data, successCallback, errorCallback) {
    data = {
        Id:data.id,
        Name: data.name,
        Type: data.type,
        Url: data.url,
        Price: data.price,
        CustomerName: data.customerName,
        CustomerPhone: data.customerPhone,
        Address: data.address
    };
    ajax().create(project.edit, {
        datas: JSON.stringify(data)
    }).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback("编辑项目成功");
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("编辑项目信息失败");
        }
    }).send();
}

/**
 * 删除项目
 */
export function del(data, successCallback, errorCallback) {
    ajax().create(project.del, data).success(function (data) {
        if (typeof successCallback === "function") {
            successCallback("删除项目成功");
        }
    }).error(function () {
        if (typeof errorCallback === "function") {
            errorCallback("删除项目失败");
        }
    }).send();
}