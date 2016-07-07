module.exports = function (data) {
    var datas = {
        dataCount: 200,
        datas: [
            {
                state: {
                    title: "未联系",
                    color: "danger",
                    remarks: "需要打电话"
                },
                type: "APP",
                name: "项目名称",
                url: "url",
                price: 10000,
                customerName: "李运",
                customerPhone: "QQ:1235151/手机:151551551515",
                address: "成都",
                createTime: Date.parse(new Date()) / 1000
            },
            {
                state: {
                    title: "未联系",
                    color: "danger",
                    remarks: "需要打电话"
                },
                type: "APP",
                name: "项目名称1",
                url: "url",
                price: 10000,
                customerName: "李运",
                customerPhone: "QQ:1235151/手机:151551551515",
                address: "成都",
                createTime: Date.parse(new Date()) / 1000
            },
        ]
    };
    data.body = datas;
}