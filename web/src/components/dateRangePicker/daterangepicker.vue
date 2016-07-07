<style>
    .daterangepicker-container {
        box-sizing: border-box;
        display: inline-block;
        margin: 0;
        position: relative;
        vertical-align: middle;
        width: 100%;
    }
    .daterangepicker-container > .daterangepicker-selection {
        background-color: #fcfcfd;
        border-color: #bdc3d1;
        border-radius: 2px;
        height: 38px;
        outline: none;
        border: 1px solid #aaa;
        box-sizing: border-box;
        cursor: pointer;
        display: block;
        -webkit-user-select: none;
        text-align: left;
        width: 100%;
    }
    .daterangepicker-container > .daterangepicker-selection > .daterangepicker-selection-rendered {
        color: #262b36;
        line-height: 36px;
        padding-left: 12px;
        display: block;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .daterangepicker-container > .daterangepicker-selection > .daterangepicker-selection-rendered > .daterangepicker-selection-placeholder {
        color: #9fa8bc;
    }
    .daterangepicker-container > .daterangepicker-selection > .daterangepicker-selection-arrow {
        width: 30px;
        height: 36px;
        line-height: 36px;
        position: absolute;
        top: 1px;
        right: 1px;
    }
    .daterangepicker-container > .daterangepicker-selection > .daterangepicker-selection-arrow > b {
        border-color: #888 transparent transparent transparent;
        border-style: solid;
        border-width: 5px 4px 0 4px;
        height: 0;
        left: 50%;
        margin-left: -4px;
        margin-top: -2px;
        position: absolute;
        top: 50%;
        width: 0;
    }
    .daterangepicker {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1;
        display: none;
        min-width: 160px;
        margin: 2px 0 0;
        list-style: none;
        font-size: 12px;
        text-align: left;
        background-color: #fff;
        border: 1px solid #ccc;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: 2px;
        background-clip: padding-box;
        padding: 5px;
        box-shadow: none;
    }
    .daterangepicker-selection:focus ~ .daterangepicker,.daterangepicker:hover {
        display: block;
    }
    .daterangepicker > .date-time {
        float: left;
    }
    .daterangepicker > .date-time:last-child {
        border-left: 1px solid #ccc;
    }
</style>
<template>
<span class="daterangepicker-container">
    <button type="button" class="daterangepicker-selection" :disabled="disabled">
        <span class="daterangepicker-selection-rendered">
            <span v-if="start && end">日期范围：{{start}} 至 {{end}}</span>
            <span class="daterangepicker-selection-placeholder" v-if="!start || !end">请选择日期范围</span>
        </span>
        <span class="daterangepicker-selection-arrow">
            <b></b>
        </span>
    </button>
    <span class="dropdown-wrapper" aria-hidden="true"></span>
    <div class="daterangepicker">
        <div class="date-time">
            <div v-el:start-datetime></div>
        </div>
        <div class="date-time" v-show="start">
            <div v-el:end-datetime></div>
        </div>
    </div>
</span>
</template>
<script>
    require("../../js/lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css");
    require("../../js/lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js");
    import formatDate from "../../js/filter/dateTime.js";

    module.exports = {
        props:{
            "view": {
                type: String,
                default: "month"
            },
            "start": {
                twoWay: true,
                type: [String, Number]
            },
            "end": {
                twoWay: true,
                type: [String, Number]
            },
            "disabled": {
                twoWay: true,
                type: Boolean,
                default: false
            }
        },
        watch: {
            "start": {
                handler: function(val){
                    return val;
                },
                immediate: true
            },
            "end": {
                handler: function(val){
                    return val;
                },
                immediate: true
            },
            "view": {
                handler: function(expression){
                    if(expression === "hour") {
                        this.format = "yyyy/MM/dd hh:mm";
                        this.viewType = "hour";
                    } else if(expression === "day") {
                        this.format = "yyyy/MM/dd hh:00";
                        this.viewType = "day";
                    } else if(expression === "month") {
                        this.format = "yyyy/MM/dd";
                        this.viewType = "month";
                    } else if(expression === "year") {
                        this.format = "yyyy/MM";
                        this.viewType = "year";
                    } else if(expression === "decade") {
                        this.format = "yyyy";
                        this.viewType = "decade";
                    }
                    return expression;
                },
                immediate: true
            }
        },
        data: function(){
            return {
                format: "",
                viewType: ""
            };
        },
        ready: function(){
            var ths = this;
            $(ths.$els.startDatetime).datetimepicker({
                format: ths.format,
                todayBtn: true,
                initialDate: ths.start || new Date(),
                startView: ths.viewType,
                minView: ths.viewType,
                maxView:'decade'
            }).on("changeDate", function(e){
                ths.start = formatDate(e.date, ths.format);
                $(ths.$els.endDatetime).datetimepicker("setStartDate", e.date);
                var endDate = $(ths.$els.endDatetime).datetimepicker("getDate");
                if(endDate < e.date) {
                    $(ths.$els.endDatetime).datetimepicker("setDate", e.date);
                     ths.end = ths.start;
                }
            });
            $(ths.$els.endDatetime).datetimepicker({
                format: ths.format,
                todayBtn: true,
                initialDate: ths.end || new Date(),
                startDate: ths.start || null,
                startView: ths.viewType,
                minView: ths.viewType,
                maxView:'decade'
            }).on("changeDate", function(e){
                ths.end = formatDate(e.date, ths.format);
            });
        }
    };

</script>