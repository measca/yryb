<template>
    <p>
        {{data.address}}
        <a href="javascript:;" class="pull-right option-btn" v-alert="'是否删除该地址?'" @yes="deletaAddress(data)">
            <i class="fa fa-trash"></i>
        </a>
        <a href="javascript:;" class="pull-right option-btn" @click="addressShow = true && !disabled">
            <i class="fa fa-pencil"></i>
        </a>
        <address-modal :value="data.value" :address-datas="data.selectDatas" :confirm="confirm" :service="addressService" :show.sync="addressShow" :close-restore="true"></address-modal>
    </p>
</template>
<script>
    module.exports = {
        props: {
            data: {
                type: Object
            },
            deletaAddress: {
                type: Function
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data: function(){
            return {
                addressShow: false
            };
        },
        methods: {
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
                this.data.address = address;
                this.data.selectDatas = selectDatas;
                this.data.value = value;
            }
        },
        components: {
            "address-modal": require("./address-list-modal.vue")
        }
    }
</script>