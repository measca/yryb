<template>
    <div class="input-group city-picker">
        <span class="input-group-addon" v-if="selectDatas.length > 0">
            {{selectDataName}}
        </span>
        <input type="text" class="form-control" placeholder="请输入地址" v-model="value" maxlength="100" :disabled="disabled">
        <div class="city-picker-dropdown">
            <ol class="breadcrumb" v-if="selectDatas.length > 0">
                <li><a href="javascript:;" v-on:click="showPer(null)">所有城市</a></li>
                <li
                v-for="data in selectDatas"
                :class="{ 'active': $index === selectDatas.length - 1 }">
                    <a href="javascript:;" v-on:click="showPer(data)" v-if="$index != selectDatas.length - 1">{{data.value}}</a>
                    <span v-else>{{data.value}}</span>
                </li>
            </ol>
            <div class="city-select-content" v-if="datas.length > 0">
                <dl v-for="data in datas">
                    <dt>{{data.key}}</dt>
                    <dd>
                        <a v-for="d in data.datas"
                        title="{{d.value}}"
                        v-on:click="showNext(d)">
                            {{d.value}}
                        </a>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
<script>
    require("./scss/css.scss");
    var toPingYin = require("../../js/lib/Hz2Py/Hz2Py.js");

    module.exports = {
        props: {
            "value": {
                type: String,
                twoWay: true
            },
            "addressValue": {
                type: String,
                twoWay: true
            },
            "selectDatas": {
                type: Array,
                twoWay: true,
                default: []
            },
            "disabled": {
                type: Boolean,
                twoWay: true,
                default: false
            },
            "service": {
                type: Function,
                default: function (data, successFn, errorFn){
                    if(!data.id) {
                        successFn([{
                            value: "上海",
                            id: 1
                        }, {
                            value: "广州",
                            id: 2
                        }, {
                            value: "四川",
                            id: 3
                        }]);
                        return;
                    } else if(data.id == 2){
                        successFn([{
                            value: "江门",
                            id: 4
                        }, {
                            value: "新会",
                            id: 5
                        }]);
                        return;
                    } else if(data.id == 3){
                        successFn([{
                            value: "成都",
                            id: 4
                        }]);
                        return;
                    }
                    successFn();
                }
            }
        },
        data: function(){
            return {
                id: null,
                selectDataName: "",
                datas: []
            };
        },
        watch: {
            "selectDatas": {
                handler: function(val) {
                    var names = [];
                    for(var i = 0,select; select = val[i++];){
                        names.push(select.value);
                    }
                    if(val.length > 0){
                        this.id = val[val.length - 1].id;
                    } else {
                        this.id = null;
                    }
                    this.selectDataName = names.join(" ") || "";
                    this.addressValue = this.selectDataName?this.selectDataName + " " + this.value : this.value;
                    this.send();
                },
                immediate: true
            },
            "value": function(value){
                this.addressValue = this.selectDataName?this.selectDataName + " " + value : value;
            }
        },
        methods: {
            send: function(){
                if(typeof this.service != "function") return;
                var sendData = this.sendData || {};
                sendData = $.extend({}, {
                    id: this.id
                }, sendData);
                this.$set("datas", []);
                this.isLogin = true;
                var ths = this;
                this.service(sendData, function (data){
                    data = data || [];
                    ths.initDatas(data);
                    ths.isLogin = false;
                }, function(){
                    ths.isLogin = false;
                });
            },
            initDatas: function(datas) {
                var pingYinObj = {};
                for(var i = 0,data; data = datas[i++];){
                    var pingYin = toPingYin(data.value)[0] || "";
                    if(!pingYinObj[pingYin]) pingYinObj[pingYin] = [];
                    pingYinObj[pingYin].push(data);
                }
                var pingYinArr = [];
                for(var key in pingYinObj){
                    pingYinArr.push({
                        key: key,
                        datas: pingYinObj[key]
                    });
                }
                pingYinArr.sort(function(val1, val2){
                    return val1.key.localeCompare(val2.key);
                });
                this.$set("datas", pingYinArr);
            },
            showNext: function(data) {
                this.selectDatas.push(data);
            },
            showPer: function(data) {
                var selectDatas = [];
                if(data) {
                    var index = 0;
                    for(var item = null;item = this.selectDatas[index++];){
                        if(item === data) break;
                    }
                    selectDatas = this.selectDatas.slice(0, index);
                }
                this.$set("selectDatas", selectDatas);
            }
        }
    }
</script>