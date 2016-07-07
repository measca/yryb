<style>
    .address-modal > .address-modal-context {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    
    .address-modal > .address-modal-context .address-list {
        width: 500px;
        margin: 100px auto 50px auto;
        background-color: #fff;
    }
    
    .address-modal .address-modal-item {
        margin-top: 4px;
        margin-right: 4px;
        padding: 4px 5px 4px 5px;
        border-color: transparent;
        border-radius: 2px;
        background-color: #259dab;
        color: #fff;
        display: inline-block;
    }
    
    .address-modal .breadcrumb {
        margin: 0;
        border: 0;
        padding: 0;
        background: none;
    }
    
    .address-modal .breadcrumb a {
        color: #f5f5f5;
    }
    
    .address-modal .breadcrumb .active {
        color: #aaacb2;
    }
</style>
<template>
    <div class="city-list-modal" v-show="show" @click.stop="show = false || static">
        <div class="panel panel-midnightblue" @click.stop="show = true">
            <div class="panel-heading">录入地址信息</div>
            <ol class="breadcrumb" v-if="selectDatas.length > 0">
                <li v-if="selectDatas.length"><a href="javascript:;" @click="showPer(null)">所有城市</a></li>
                <li v-for="selectData in selectDatas" v-if="$index != selectDatas.length - 1">
                    <a href="javascript:;" @click="showPer(selectData)">
                        {{selectData.value}}
                    </a>
                </li>
                <li class="active" v-if="selectDatas.length" >
                    {{selectDatas[selectDatas.length - 1].value}}
                </li>
            </ol>
            <div class="panel-body value-body">
                <div class="input-group">
                    <span class="input-group-addon" v-if="selectDataName">{{selectDataName}}</span>
                    <input type="text" class="form-control" placeholder="请输入详细地址" maxlength="100" v-model="editValue">
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-primary" @click.stop="subData">确定</button>
                    </span>
                </div>
            </div>
            <div class="panel-body city-list-data" v-if="datas.length > 0">
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
    var toPingYin = require("../../js/lib/Hz2Py/Hz2Py.js");
    module.exports = {
        props: {
            value: {
                type: String,
                default: ""
            },
            /**
             * 所选的数据
             */
            addressDatas: {
                type: Array,
                default: []
            },
            /**
             * 确定后触发的方法,有四个参数,
             * 第一个参数:地址全名称 type{String}
             * 第二个参数:所选的地址对象 type{Array}
             * 第三个参数:输入框的内容 type{String}
             * 第四个参数:所选地址的名称 type{String}
             */
            confirm: {
                type: Function
            },
            /**
             * 提交的附加数据
             */
            sendData: {
                type: Object
            },
            /**
             * 提交数据的Service方法
             */
            service: {
                type: Function
            },
            /**
             * 是否显示
             */
            show: {
                type: Boolean,
                twoWay: true,
                default: false
            },
            /**
             * 点击背景是否关闭
             */
            static: {
                type: Boolean,
                default: false
            },
            /**
             * 关闭的时候是否复原最后一次确定的数据
             */
            closeRestore: {
                type: Boolean,
                default: false
            },
            /**
             * 显示的时候是否重置数据
             */
            showReset: {
                type: Boolean,
                default: false
            },
            /**
             * 确定后是否重置数据
             */
            subReset: {
                type: Boolean,
                default: false
            }
        },
        data: function(){
            return {
                id: null,
                oldValue: "",
                oldSelectDatas: [],
                editValue: "",
                selectDatas: [],
                isLogin: false,
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
                    this.selectDataName = names.join(" ");
                    this.send();
                    return val;
                },
                immediate: true
            },
            "show": {
                handler: function(val) {
                    if(this.closeRestore && !val) {
                        this.editValue = this.oldValue;
                        this.$set("selectDatas", $.extend([], this.oldSelectDatas));
                    }
                    if(this.showReset) {
                        this.editValue = "";
                        this.$set("selectDatas", []);
                    }
                    return val;
                },
                immediate: true
            }
        },
        methods: {
            initDatas: function(datas){
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
            showNext: function(data){
                this.selectDatas.push(data);
            },
            showPer: function(data){
                var selectDatas = [];
                if(data) {
                    var index = 0;
                    for(var item = null;item = this.selectDatas[index++];){
                        if(item === data) break;
                    }
                    selectDatas = this.selectDatas.slice(0, index);
                }
                this.$set("selectDatas", selectDatas);
            },
            subData: function(){
                if(typeof this.confirm === "function"){
                    var selectDataName = this.selectDataName ? this.selectDataName + " " : "";
                    var value = selectDataName + this.editValue;
                    if(value) this.confirm(value || "", this.selectDatas, this.editValue, this.selectDataName);
                }
                this.oldValue = this.editValue;
                this.$set("oldSelectDatas", this.selectDatas);
                if(this.subReset) {
                    this.editValue = "";
                    this.$set("selectDatas", []);
                }
                this.show = false;
            },
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
            }
        },
        ready: function(){
            this.editValue = this.value;
            this.$set("selectDatas", $.extend([], this.addressDatas));
            this.oldValue = this.editValue;
            this.$set("oldSelectDatas", $.extend([], this.selectDatas));
        }
    }

</script>