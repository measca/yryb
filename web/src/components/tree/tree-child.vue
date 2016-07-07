<template>
    <li v-for="data in datas">
        <span class="button switch"
        :class="{
            'center_open': data.show && datas.length - 1 != $index && data.child && data.child.length > 0,
            'center_close': !data.show  && datas.length - 1 != $index && data.child && data.child.length > 0,
            'bottom_open': data.show && datas.length - 1 === $index && data.child && data.child.length > 0,
            'bottom_close': !data.show && datas.length - 1 === $index && data.child && data.child.length > 0,
            'center_docu': (!data.child  || !data.child.length) && datas.length - 1 != $index,
            'bottom_docu': (!data.child  || !data.child.length) && datas.length - 1 === $index
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
            <tree-child :datas="data.child" :check="check" :delete="delete" :add="add" :edit="edit" :cancel="cancel"></tree-child>
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
</template>
<script>
    require("../../js/directive/popover.alert.js");
    
    module.exports = {
        props: {
            datas: {
                type: Array
            },
            check: {
                type:Function
            },
            delete: {
                type:Function
            },
            edit: {
                type:Function
            },
            cancel: {
                type:Function
            },
            add: {
                type:Function
            }
        }
    }
</script>