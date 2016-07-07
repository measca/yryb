<template>
    <div class="form-group dropdown-input">
        <input class="form-control dropdown-input" type="text" v-model="value" @keyup.38="showUp" @keyup.40="showDom" @keyup.enter="selectVal">
        <span class="dropdown-input-menu">
            <span class="dropdown-input-menu-results">
                <ul class="dropdown-input-menu-results-options" v-el:options>
                    <li class="dropdown-input-menu-results__option" v-for="data in datas" :class="
                        {'dropdown-input-menu-results__option--highlighted': data.selected}
                    " @mousemove="mousemoveItem(data)" @click="selectVal">{{data.value}}</li>
                </ul>
            </span>
        </span>
    </div>
</template>
<script>
    require("./scss/css.scss");
    module.exports = {
        props: {
            value: {
                type:String,
                twoWay: true
            }
        },
        data: function(){
            return {
                datas: []
            };
        },
        methods: {
            mousemoveItem: function(data){
                for(var i = 0,item; item = this.datas[i++];) {
                    if(item != data){
                        item.selected = false;
                    }
                }
                data.selected = true;
            },
            selectVal: function(){
                for(var i = 0; i < this.datas.length;i++) {
                    var item = this.datas[i];
                    if(item.selected){
                        this.value = item.value;
                        break;
                    }
                }
            },
            showUp: function(e){
                var index = null;
                for(var i = 0; i < this.datas.length;i++) {
                    var item = this.datas[i];
                    if(item.selected){
                        index = i;
                        item.selected = false;
                        break;
                    }
                }
                if(index == null) {
                    index = 0;
                } else if(index - 1 < 0){
                    index = this.datas.length - 1;
                } else {
                    index = index - 1;
                }
                if(index >= 0) {
                    var data = this.datas[index];
                    if(data) data.selected = true;
                }
                var li = $("li", this.$els.options).eq(index);
                var position = li.position();
                $(this.$els.options).scrollTop(position.top - 4);
            },
            showDom: function(){
                var index = null;
                for(var i = 0; i < this.datas.length;i++) {
                    var item = this.datas[i];
                    if(item.selected){
                        index = i;
                        item.selected = false;
                        break;
                    }
                }
                if(index == null) {
                    index = 0;
                } else if(index + 1 > this.datas.length - 1){
                    index = 0;
                } else {
                    index = index + 1;
                }
                if(index >= 0) {
                    var data = this.datas[index];
                    if(data) data.selected = true;
                }
                var li = $("li", this.$els.options).eq(index);
                var position = li.position();
                $(this.$els.options).scrollTop(position.top - 4);
            }
        },
        ready: function(){
            var arr = [
                "a","b","c","d","e","f","g","h","i","j","k","l"
            ];
            for(var i = 0, item; item = arr[i++];){
                this.datas.push({
                    selected: false,
                    value: item
                });
            }
        }
    }
</script>