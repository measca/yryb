<style></style>
<template>
    <div class="modal-open" v-show="visible">
        <div class="modal" v-show="visible" @click.stop="modalClick">
            <div class="modal-dialog" @click.stop="contentClick" :class="size">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="visible = false">×</button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>
        <div class="modal-backdrop in"></div>
    </div>
</template>
<script>
    require("./scss/css.scss");

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            static: {
                type: Boolean,
                default: false
            },
            size: {
                type: String
            },
            title: {
                type: String
            }
        },
        watch: {
            visible: {
                handler(value) {
                    setTimeout(()=>{
                        let count = $(".modal:visible").size();
                        if(count) {
                            $("body").addClass("modal-open");
                        } else {
                            $("body").removeClass("modal-open");
                        }
                    }, 0);
                },
                immediate: true
            }
        },
        methods:{
            contentClick:function(){},
            modalClick:function(){
                if(!this.static){
                  this.visible = false;
                }
            }
        }
    }
</script>