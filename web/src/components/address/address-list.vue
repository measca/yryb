<template>
    <div class="panel">
        <div class="panel-body">
            <ul class="city-list-picker">
                <li v-for="data in addressDatas">
                    <address-item :data="data" :deleta-address="deletaAddress" :disabled="disabled"></address-item>
                </li>
                <li>
                    <a href="javascript:;" class="text-primary" @click="modalShow = true && !this.disabled;">
                        <i class="fa fa-plus"></i> 添加地址
                    </a>
                </li>
            </ul>
        </div>
        <address-modal :show.sync="modalShow" :service="addressService" :sub-reset="true" :confirm="confirm"></address-modal>
    </div>
</template>
<script>
    require("./scss/list.scss");

    module.exports = {
        props: {
            addressDatas: {
                type: Array,
                twoWay: true,
                default: []
            },
            disabled: {
                type: Boolean,
                twoWay: true,
                default: false
            }
        },
        data: function(){
            return {
                modalShow: false
            }
        },
        methods: {
            deletaAddress: function(data) {
                if(!disabled) this.addressDatas.$remove(data);
            },
            addressService: function(data, successFn, errorFn){
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
            },
            confirm: function(address, selectDatas, value) {
                this.addressDatas.push({
                    address: address,
                    selectDatas: selectDatas,
                    value: value
                });
            }
        },
        components: {
            "address-modal": require("./address-list-modal.vue"),
            "address-item": require("./address-list-item.vue")
        }
    }
</script>