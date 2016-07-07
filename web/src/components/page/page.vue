<template>
    <ul class="pagination pagination-sm">
		<li :class="{ disabled: !alwaysShowPrev }">
            <a href="javascript:;" title="跳转到 上一页" @click="prevPage">
                <i class="fa fa-angle-left"></i>
            </a>
        </li>
        <li v-if="showFirstOmit">
            <a href="javascript:;" @click="goPage(1)">1</a>
        </li>
        <li class="omission" v-if="showFirstOmit">...</li>

		<li v-for="page in pages" :class="{ active: page === currentPage }">
            <a href="javascript:;" title="跳转到第 {{page}}页" @click="goPage(page)">{{page}}</a>
        </li>

		<li class="omission" v-if="showLastOmit">...</li>
        <li v-if="showLastOmit">
            <a href="javascript:;" @click="goPage(totalPages)">{{totalPages}}</a>
        </li>
		<li :class="{ disabled: !alwaysShowNext }">
            <a href="javascript:;" title="跳转到 下一页" @click="nextPage">
                <i class="fa fa-angle-right"></i>
            </a>
        </li>
	</ul>
</template>
<script>
    module.exports = {
        props: {
            perPages: {//@config {Number} 每页包含多少条目
                type: [Number, String],
                default: 10,
                twoWay: true
            },
            showPages: {//@config {Number} 中间部分一共要显示多少页(如果两边出现省略号,即它们之间的页数)
                type: Number,
                default: 5,
                twoWay: true
            },
            currentPage: { //@config {Number} 当前选中的页面 (按照人们日常习惯,是从1开始)，它会被高亮
                type: Number,
                default: 1,
                twoWay: true
            },
            totalItems: { //@config {Number} 总条目数
                type: Number,
                default: 0,
                twoWay: true
            },
            change: {
                type: Function
            }
        },
        data: function(){
            return {
                totalPages: 0, //@config {Number} 总页数,通过Math.ceil(vm.totalItems / vm.perPages)求得
                pages: [], //@config {Array} 要显示的页面组成的数字数组，如[1,2,3,4,5,6,7]
                firstPage: 0, //@config {Number} 当前可显示的最小页码，不能小于1
                lastPage: 0, //@config {Number} 当前可显示的最大页码，不能大于totalPages
                alwaysShowNext: false, //@config {Boolean} 总是显示向后按钮
                alwaysShowPrev: false, //@config {Boolean} 总是显示向前按钮
                showFirstOmit: false, //是否显示前省略号
                showLastOmit: false//是否显示后省略号
            }
        },
        methods: {
            initPages: function (c) {
                var max = Math.ceil(this.totalItems / this.perPages), pages = [], s = this.showPages;
                //一共有p页，要显示s个页面
                this.totalPages = max;//总页数
                if(c > max) c = this.currentPage = max < 1 ? 1 : max;
                var left = c, right = c;
                if (max <= s) {
                    for (var i = 1; i <= max; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(c)
                    while (true) {
                        if (pages.length >= s) {
                            break
                        }
                        if (left > 1) {//在日常生活是以1开始的
                            pages.unshift(--left)
                        }
                        if (pages.length >= s) {
                            break
                        }
                        if (right < max) {
                            pages.push(++right)
                        }
                    }
                }
                this.firstPage = pages[0] || 1
                this.lastPage = pages[pages.length - 1] || 1
                this.showFirstOmit = this.firstPage > 2
                this.showLastOmit = this.lastPage < max - 1
                this.alwaysShowPrev = this.currentPage > 1 && pages.length > 0;
                this.alwaysShowNext = this.totalPages > this.currentPage && pages.length > 0;
                this.$set("pages", pages);
            },
            goPage: function(page) {
                if(isNaN(page) || page === this.currentPage || page < 1 || page > this.totalPages) return;
                this.currentPage = Math.floor(page);
            },
            prevPage: function(){
                this.goPage(this.currentPage - 1);
            },
            nextPage: function(){
                this.goPage(this.currentPage + 1);
            }
        },
        watch: {
            "currentPage": function(val){
                this.initPages(val);
                if(typeof this.change === "function"){
                    this.change(val, this.perPages);
                }
            },
            "totalItems": function(val){
                this.initPages(this.currentPage);
            },
            "perPages":  function(val){
                this.initPages(this.currentPage);
                if(typeof this.change === "function"){
                    this.change(this.currentPage, this.perPages);
                }
            },
            "showPages": function(val){
                this.initPages(this.currentPage);
                if(typeof this.change === "function"){
                    this.change(this.currentPage, this.perPages);
                }
            }
        }
    }
</script>