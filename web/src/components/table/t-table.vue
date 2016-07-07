<style lang="scss">
    .table-option {
        text-align: center;
        a {
            margin-left: 5px;
            &:first-child {
                margin-left: 0;
            }
        }
    }
    .table-responsive {
        position: relative;
    }
</style>
<template>
    <div class="panel panel-{{skin}}">
        <div class="panel-heading">
            <h2>{{title}}</h2>
            <div class="panel-ctrls">
                <button type="button" class="btn btn-sm btn-{{skin}}" v-on:click="reloadAsyncData" :disabled="$loadingAsyncData">
                    <i class="fa fa-refresh"></i>
                </button>
                <div class="btn-group">
                    <div class="btn-check btn-check-sm">
                        <input type="radio" value="10" v-model="perPages" number :disabled="$loadingAsyncData">
                        <label class="btn btn-{{skin}}">10</label>
                    </div>
                    <div class="btn-check btn-check-sm">
                        <input type="radio" value="30" v-model="perPages" number :disabled="$loadingAsyncData">
                        <label class="btn btn-{{skin}}">30</label>
                    </div>
                    <div class="btn-check btn-check-sm">
                        <input type="radio" value="50" v-model="perPages" number :disabled="$loadingAsyncData">
                        <label class="btn btn-{{skin}}">50</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-responsive">
            <loading :show="$loadingAsyncData"></loading>
            <table v-el:table class="table table-striped table-bordered m0">
                <thead>
                    <tr>
                        <th v-for="b in bind" :class="b.class" :style="b.style">
                            {{b.title}}
                        </th>
                        <th v-if="btn" :class="btn.class" :style="btn.style">
                            {{btn.title}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="data in datas">
                        <td v-for="(key, b) in bind" :class="b.class">
                            {{ b.ready ? b.ready(data[key]) : data[key]}}
                        </td>
                        <td class="table-option"
                            v-if="btn && btn.data && btn.data.length > 0"
                            :class="btn.class">
                            <a
                                href="javascript:;"
                                v-for="btn in btn.data"
                                :class="btn.class"
                                v-tooltip.hover
                                :tooltip-val="btn.tooltip"
                                v-on:click="clickBtn($event, data, btn)">
                                {{{btn.context}}}
                            </a>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="999999" class="text-right">
                            <page></page>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                default: "数据集"
            },
            skin: {
                type: String,
                default: "brown"
            },
            showPages: {//@config {Number} 中间部分一共要显示多少页(如果两边出现省略号,即它们之间的页数)
                type: Number,
                default: 10,
                twoWay: true
            },
            currentPage: { //@config {Number} 当前选中的页面 (按照人们日常习惯,是从1开始)，它会被高亮
                type: Number,
                default: 1,
                twoWay: true
            },
            config: {
                type: String
            }
        },
        data() {
            return {
                datas: [],
                perPages: 10,
                totalItems: 0,
                bind: {},
                btn: []
            };
        },
        asyncData(resolve, reject){
            let config = this.config || "table";
            let tableConfig = this.$parent.$options[config];
            let sendData = {};
            if(tableConfig.data && typeof tableConfig.data === "function") {
                let data = tableConfig.data.call(this.$parent);
                if(data) {
                    $.extend(sendData, data);
                }
            } else if(tableConfig.data) {
                $.extend(sendData, tableConfig.data);
            }
            sendData.pageIndex = this.currentPage;
            sendData.pageSize = this.perPages;
            tableConfig.service(sendData, (data) => {
                let tData = {
                    datas: data.datas,
                    totalItems: data.pageCount
                }
                resolve(tData);
            }, (msg) => {
                reject();
            });
        },
        methods: {
            clickBtn(e, data, btn){
                btn.active.call(this.$parent, data);
            },
            pageChang(){
                this.reloadAsyncData();
            }
        },
        ready() {
            this.thisData = this.$parent;
            let config = this.config || "table";
            let tableConfig = this.$parent.$options[config];
            if(tableConfig.btn) {
                this.$set("btn", tableConfig.btn);
            }
            if(tableConfig.binding) {
                for(let key in tableConfig.binding) {
                    let val = tableConfig.binding[key];
                    let typeStr = Object.prototype.toString.call(val);
                    if(typeStr === "[object String]") {
                        val = {
                            title: val
                        };
                    }
                    this.$set("bind." + key, val);
                }
            }
            var directives = this.$parent._directives;
            for(let i = 0, directive; directive = directives[i++];){
                if(directive.childVM === this) {
                    let html = directive.el.innerHTML;
                    if(html) {
                        var a = new Vue.FragmentFactory(this, html);
                        var b = a.create(this);
                        b.before(this.$els.table);
                        $(this.$els.table).remove();
                    }
                }
            }
        },
        components: {
            page: {
                template: `
                    <page-temp
                        :total-items="parentData.totalItems"
                        :show-pages="parentData.showPages"
                        :current-page="parentData.currentPage"
                        :per-pages="parentData.perPages"
                        :change="parentData.pageChang"></page-temp>
                `,
                data(){
                    return {
                        parentData: this.$parent
                    };
                },
                components: {
                    pageTemp: require("../../components/page/page.vue")
                }
            },
            loading: require("../logging/logging.vue")
        }
    }
</script>