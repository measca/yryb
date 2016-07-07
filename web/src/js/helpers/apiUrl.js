export const user = {
    login: {
        type: "POST",
        url: "/api/login"
    } //登录地址
}

export const share = {
    type: {
        url: "/api/type",
        dataType: "json"
    },//发送验证码地址
    state: {
        url: "/api/state",
        dataType: "json"
    }//获取用户所拥有的菜单
}

export const project = {
    add: {
        url: "/api/projectAdd",
        type: "POST"
    },
    list: {
        url: "/api/projectList",
        dataType: "json"
    },
    stateInfo: {
        url: "/api/projectStateInfo",
        dataType: "json"
    },
    setState: {
        url: "/api/projectAddState",
        type: "POST"
    },
    edit: {
        url: "/api/projectEdit",
        type: "POST"
    },
    del: {
        url: "/api/projectDel",
        type: "POST"
    }
}