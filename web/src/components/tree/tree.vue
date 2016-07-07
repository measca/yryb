<style>
    .tree-btns .btn{
        margin: 0 5px;
    }
    .tree-btns .btn {
        display: none;
    }
    .tree-btns:hover .btn {
        display: inline-block;
    }
    .tree-btns .btn:focus {
        display: inline-block;
    }
    .tree-btns:hover {
        padding-top: 0px;
        background-color: #e5e5e5;
        color: black;
        height: 21px;
        opacity: 0.8;
    }
    .tree-btns.edit-name .btn{
        display: inline-block;
    }
    .tree-add {
        padding-left: 15px !important;
    }
    .tree-add [contenteditable]{
        border-bottom: 1px solid #ccc;
    }
    .tree-add-margin5 {
        margin-top: 5px !important;
    }
</style>
<template>
    <ul class="ztree">
        <li v-for="data in datas">
            <span class="switch"
            :class="{
                'button': datas.length > 1,
                'roots_open': data.show && $index === 0 && datas.length > 1 && data.child && data.child.length > 0,
                'roots_close': !data.show && $index === 0 && datas.length > 1 && data.child && data.child.length > 0,
                'center_open': data.show && $index > 0 && datas.length - 1 != $index && data.child && data.child.length > 0,
                'center_close': !data.show && $index > 0 && datas.length - 1 != $index && data.child && data.child.length > 0,
                'bottom_open': data.show && datas.length - 1 === $index && data.child && data.child.length > 0,
                'bottom_close': !data.show && datas.length - 1 === $index && data.child && data.child.length > 0,
                'roots_docu': (!data.child  || !data.child.length) && $index === 0 && datas.length > 1,
                'center_docu': (!data.child  || !data.child.length) && $index > 0 && datas.length - 1 != $index,
                'bottom_docu': (!data.child  || !data.child.length) && datas.length - 1 === $index && datas.length > 1
            }" @click="data.show = !data.show"></span>
            <span class="button chk"
            :class="{
                'checkbox_true_part': data.check === 2,
                'checkbox_true_full': data.check === 1,
                'checkbox_false_full': data.check === 0,
            }" @click="check(data)"></span>
            <div class="tree-btns" :class="{'edit-name': data.edit}">
                <span class="button"
                :class="{
                    'ico_open': data.show && data.child && data.child.length > 0,
                    'ico_close': !data.show && data.child && data.child.length > 0,
                    'ico_docu': !data.child || !data.child.length
                }" @click="data.show = !data.show"></span>
                <span :contenteditable="data.edit">{{data.text}}</span>
                <a href="javascript:;" class="fa fa-times-circle btn" v-if="!data.edit" v-popover-alert data-content="确定要删除节点以及节点的子节点吗?" @click.stop @ok="delete(data)"></a>
                <a href="javascript:;"  class="fa fa-pencil btn" v-if="!data.edit" @click.stop="data.edit = true"></a>
                <a href="javascript:;"  class="fa fa-plus btn" v-if="!data.edit" @click.stop="data.isAdd = true"></a>
                <a class="fa fa-check btn" v-if="data.edit" @click.stop="data.edit = false,edit(data, $event)"></a>
                <a class="fa fa-close btn" v-if="data.edit" @click.stop="data.edit = false,cancel(data, $event)"></a>
            </div>
            <ul :class="{ 'line': datas.length - 1 != $index }" v-if="data.child && data.child.length > 0" v-show="data.show">
                <tree-child :datas="data.child" :check="check" :delete="delete" :edit="edit" :cancel="cancel" :add="add"></tree-child>
            </ul>
            <ul :class="{ 'line': datas.length - 1 != $index }">
                <li class="tree-add" v-if="data.isAdd">
                    <div class="tree-btns edit-name">
                        <span class="fa fa-plus"></span>
                        <span contenteditable></span>
                        <a class="fa fa-check btn" @click="add(data, $event)"></a>
                        <a class="fa fa-close btn" @click="data.isAdd = false"></a>
                    </div>
                </li>
            </ul>
        </li>
        <li class="tree-add tree-add-margin5" v-if="!isAdd">
            <div class="tree-btns edit-name" @click="isAdd = true">
                <span class="fa fa-plus"></span>
                <span>新增节点</span>
            </div>
        </li>
        <li class="tree-add tree-add-margin5" v-if="isAdd">
            <div class="tree-btns edit-name">
                <span class="fa fa-plus"></span>
                <span contenteditable></span>
                <a class="fa fa-check btn" @click="add(null, $event)"></a>
                <a class="fa fa-close btn" @click="isAdd = false"></a>
            </div>
        </li>
    </ul>
</template>
<script>
    require("./css/metro.css");
    require("../../js/directive/popover.alert.js");

    Vue.component('treeChild', require("./tree-child.vue"));

    module.exports = {
        props: {
            treeDatas: {
                type: Array,
                default: [
                    {
                        value: "显示的内容",
                        id: 0,
                        perId: null
                    },
                    {
                        value: "显示的内容",
                        id: 1,
                        perId: null
                    },
                    {
                        value: "显示的内容",
                        id: 2,
                        perId: 0
                    },
                    {
                        value: "显示的内容",
                        id: 3,
                        perId: 2
                    },
                    {
                        value: "显示的内容",
                        id: 4,
                        perId: 3
                    },
                    {
                        value: "显示的内容",
                        id: 5,
                        perId: 0
                    },
                    {
                        value: "显示的内容",
                        id: 6,
                        perId: 2
                    }
                ]
            },
            valueAttr: {
                type: String,
                default: "value"
            },
            perAttr: {
                type: String,
                default: "perId"
            },
            idAttr: {
                type: String,
                default: "id"
            },
            addTree: {
                type: Function
            },
            editTree: {
                type: Function
            },
            deleteTree: {
                type: Function
            }
        },
        data: function(){
            return {
                /**
                 * 每个数据的格式.
                 * 属性:
                 *  check {Number} 是否选中 0:为未选中 1:为全选 2:为部分选中
                 *  show {Boolean} 是否显示
                 *  edit {Boolean} 是否编辑
                 *  data {Object} 存储的数据
                 *  text {String} 显示的内容
                 *  parent {Object} 父节点
                 *  child {Array} 子节点
                 */
                datas: [],
                isAdd: false
            };
        },
        methods: {
            add: function(treeItem, e){
                var textDom = $(e.target).closest('.tree-btns').find("[contenteditable]");
                var text = textDom.html();
                var ths = this;
                if(typeof this.addTree === "function") {
                    var fun = function(treeData) {
                        var data = {
                            check: 0,
                            show: false,
                            edit: false,
                            isAdd: false,
                            data: treeData,
                            text: text,
                            parent: treeItem,
                            child:[]
                        };
                        if(!treeItem) {
                            ths.datas.push(data);
                            ths.isAdd = false;
                        } else {
                            if(!treeItem.child) treeItem.child = [];
                            treeItem.child.push(data);
                            treeItem.isAdd = false;
                        }
                    }
                    this.addTree(text, fun);
                }
                textDom.html('');
            },
            edit: function(data, e){
                var text = $(e.target).closest('.tree-btns').find("[contenteditable]").html();
                data.text = text;
                data.data[this.valueAttr] = text;
                if(typeof this.editTree === "function") {
                    this.editTree(data.data);
                }
            },
            cancel: function(data, e){
                $(e.target).closest('.tree-btns').find("[contenteditable]").html(data.text);
            },
            delete: function(tree){
                if(typeof this.deleteTree === "function") {
                    var fun = function() {
                        if(tree.parent) {
                            var index = null;
                            for (var i = 0; i < tree.parent.child.length; i++) {
                                if (tree.parent.child[i] == tree) {
                                    index = i;
                                    break;
                                }
                            }
                            tree.parent.child.splice(index, 1);
                        } else {
                            this.datas.$remove(tree);
                        }
                    }
                    this.deleteTree(tree.data, fun);
                }
            },
            checkPer: function (data){
                if(data) {
                    var checkLength = data.child.length;
                    for(var i = 0, child; child = data.child[i++];) {
                        if(child.check === 0) {
                            checkLength = checkLength - 1;
                        }
                    }
                    if(checkLength === data.child.length) {
                        data.check = 1;
                    } else if(checkLength > 0) {
                        data.check = 2;
                    } else {
                        data.check = 0;
                    }
                    this.checkPer(data.parent);
                }
            },
            checkNext: function (data){
                if(data.child && data.child.length) {
                    for(var i = 0,child; child = data.child[i++];) {
                        child.check = data.check;
                        this.checkNext(child);
                    }
                }
            },
            check: function(data){
                data.check = data.check === 1 ? 0 : 1;
                this.checkNext(data);
                this.checkPer(data.parent);
            },
            initDatas: function(pid, perItem){
                var tempData = [];
                for(var i = 0, item; item = this.treeDatas[i++];) {
                    if((item[this.perAttr] || null) === pid) {
                        var data = {
                            check: 0,
                            show: false,
                            edit: false,
                            isAdd: false,
                            data: item,
                            text: item[this.valueAttr],
                            parent: perItem || null,
                            child: []
                        };
                        var child = this.initDatas(item[this.idAttr], data);
                        if(child.length > 0) {
                            data.child = child;
                        }
                        tempData.push(data);
                    }
                }
                if(pid === null) {
                    this.$set("datas", tempData);
                } else {
                    return tempData;
                }
            }
        },
        ready: function(){
            this.initDatas(null);
        }
    };
</script>