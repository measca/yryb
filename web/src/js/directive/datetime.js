require("./scss/datetime.scss");

let template = `
<div class="laydate_box">
    <div class="laydate_top">
        <div class="laydate_ym laydate_y">
            <a class="laydate_choose laydate_chprev laydate_tab">
                <cite></cite>
            </a>
            <input readonly>
            <label></label>
            <a class="laydate_choose laydate_chnext laydate_tab">
                <cite></cite>
            </a>
            <div class="laydate_yms">
                <a class="laydate_tab laydate_chtop">
                    <cite></cite>
                </a>
                <ul></ul>
                <a class="laydate_tab laydate_chdown">
                    <cite></cite>
                </a>
            </div>
        </div>
        <div class="laydate_ym laydate_m">
            <a class="laydate_choose laydate_chprev laydate_tab">
                <cite></cite>
            </a>
            <input readonly="">
            <label></label>
            <a class="laydate_choose laydate_chnext laydate_tab">
                <cite></cite>
            </a>
            <div class="laydate_yms">
            </div>
        </div>
    </div>
    <table class="laydate_table">
        <thead>
            <tr>
                <th>日</th>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th>六</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    <div class="laydate_bottom">
        <ul class="laydate_hms">
            <li class="laydate_sj">时间</li>
            <li><input readonly=""></li>
            <li>:<input readonly=""></li>
            <li>:<input readonly=""></li>
        </ul>
        <div class="laydate_time hour">
            <div class="laydte_hsmtex">
                小时<span>×</span>
            </div>
            <div class="laydate_hmsno"></div>
        </div>
        <div class="laydate_time laydate_time1 minute">
            <div class="laydte_hsmtex">分钟<span>×</span></div>
            <div class="laydate_hmsno"></div>
        </div>
        <div class="laydate_time laydate_time1 seconds">
            <div class="laydte_hsmtex">秒数<span>×</span></div>
            <div class="laydate_hmsno"></div>
        </div>
        <div class="laydate_btn">
            <a>今天</a>
        </div>
    </div>
</div>
`;

class Datetime {
    constructor(dom, {
        min = "1900-03-01 00:00:00",
        max = "2099-10-31 23:59:59",
        date = new Date(),
        format = "yyyy/MM/dd HH:mm:ss",
        isTodayBtn = true,
        change = ()=>{}
    } = {}) {
        if($.type(date) === "string") {
            date = new Date(date);
        }
        this._option = {
            min: min,
            max: max,
            format: format,
            isTodayBtn: isTodayBtn,
            $el: $(dom),
            isHourse: false
        };
        this._datatime = {
            $dom: $(template),
            show: date,
            yearIndex: date.getFullYear() - 7,
            value: new Date(date.getTime())
        };
        this._change = change;
        this.init();
        this.initHeadYear();
        this.initHeadMonth();
        this.initHour();
        this.initMinute();
        this.initSeconds();
        this.initShowVal();
    }
    init() {
        let self = this;
        let _HH = self._option.format.indexOf("HH");
        let _mm = self._option.format.indexOf("mm");
        let _ss = self._option.format.indexOf("ss");
        if(!self._option.isTodayBtn){
            self._datatime.$dom.find(".laydate_btn > a").css("display", "none");
        }
        self._datatime.$dom.find(".laydate_btn > a").on("click", () => {
            self._datatime.value.setTime(new Date().getTime());
            self.change("today");
        });
        if(_HH === -1 && _mm === -1 && _ss === -1) {
            self._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms")
                .css("display", "none");
        } else if(_HH === -1) {
            self._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms li:eq(1)")
                .css("display", "none");
        } else if(_mm === -1) {
            self._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms li:eq(2)")
                .css("display", "none");
        } else if(_ss === -1) {
            self._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms li:eq(3)")
                .css("display", "none");
        }
        self._option.$el.on("focusin", () => {
            self.show();
        }).on("focusout", () => {
            if(!self._option.isHourse) {
                self.hide();
            }
        });
        self._datatime.$dom.on("mouseenter", () => {
            self._option.isHourse = true;
        }).on("mouseleave", () => {
            self._option.isHourse = false;
            if(self._option.$el.is(":focus")) {
                return;
            }
            self.hide();
        });
    }
    initHeadYear(){
        let self = this;
        let years = this._datatime.$dom.find(".laydate_y");
        years.find("> a:first").on("click", (e) => {
            let a = $(e.currentTarget);
            if(a.hasClass("laydate_disabled")) return;
            let showDatetime = self._datatime.show;
            self.setYear(showDatetime.getFullYear() - 1);
        });
        years.find("> a:last").on("click", (e) => {
            let a = $(e.currentTarget);
            if(a.hasClass("laydate_disabled")) return;
            let showDatetime = self._datatime.show;
            self.setYear(showDatetime.getFullYear() + 1);
        });
        years.find("> input,> label").on("click", () => {
            if(years.find(".laydate_yms:visible").size() > 0) {
                years.find(".laydate_yms").css("display", "none");
            } else {
                years.find(".laydate_yms").css("display", "block");
            }
        });
        years.find("> .laydate_yms").on("mouseleave", () => {
            years.find(".laydate_yms").css("display", "none");
        });
        years.find("> .laydate_yms > a:first").on("click", (e) => {
            let a = $(e.currentTarget);
            if(a.hasClass("laydate_disabled")) return;
            self._datatime.yearIndex -= 14;
            self.initHeadYearList();
        });
        years.find("> .laydate_yms > a:last").on("click", (e) => {
            let a = $(e.currentTarget);
            if(a.hasClass("laydate_disabled")) return;
            self._datatime.yearIndex += 14;
            self.initHeadYearList();
        });
        this.initHeadYearList();
    }
    initHeadYearVal(){
        let years = this._datatime.$dom.find(".laydate_y");
        let ul = years.find(".laydate_yms > ul");
        let showDatetime = this._datatime.show;
        let yearVal = showDatetime.getFullYear();
        let minYear = new Date(this._option.min).getFullYear();
        let maxYear = new Date(this._option.max).getFullYear();
        years.find("> input").val(yearVal + "年");
        ul.find("> li").removeClass("laydate_click").each((index, data) => {
            let li = $(data);
            let thisYear = parseInt(li.html());
            if(thisYear == yearVal) {
                li.addClass("laydate_click");
            }
        });
        if(yearVal <= minYear) {
            years.find("> a:first").addClass("laydate_disabled");
        } else {
            years.find("> a:first").removeClass("laydate_disabled");
        }
        if(yearVal >= maxYear) {
            years.find("> a:last").addClass("laydate_disabled");
        } else {
            years.find("> a:last").removeClass("laydate_disabled");
        }
    }
    initHeadYearList() {
        let self = this;
        let showDatetime = this._datatime.show;
        let thisYear = showDatetime.getFullYear();
        let yearVal = this._datatime.yearIndex;
        let years = this._datatime.$dom.find(".laydate_y");
        let ul = years.find(".laydate_yms > ul");
        let minYear = new Date(this._option.min).getFullYear();
        let maxYear = new Date(this._option.max).getFullYear();
        ul.empty();
        for(let i = yearVal; i < yearVal + 14;i++ ){
            let li = $("<li>").html(i + "年").appendTo(ul);
            if(i < minYear || i > maxYear) {
                li.addClass("laydate_void");
            } else if(i == thisYear) {
                li.addClass("laydate_click");
            }
            li.on("click", (e) => {
                let li = $(e.target);
                if(li.hasClass("laydate_void") || li.hasClass("laydate_click")) return;
                years.find("> input").click();
                self.setYear(parseInt($(e.target).html()));
            });
        }
        if(yearVal <= minYear) {
            years.find(".laydate_yms > a:first").addClass("laydate_disabled");
        } else {
            years.find(".laydate_yms > a:first").removeClass("laydate_disabled");
        }
        if(yearVal + 14 >= maxYear) {
            years.find(".laydate_yms > a:last").addClass("laydate_disabled");
        } else {
            years.find(".laydate_yms > a:last").removeClass("laydate_disabled");
        }
    }
    setYear(year){
        this._datatime.show.setYear(year);
        this.initShowVal();
    }
    initHeadMonth(){
        let self = this;
        let months = this._datatime.$dom.find(".laydate_m");
        let yms = months.find(".laydate_yms");
        months.find("> a:first").on("click", (e) => {
            let a = $(e.currentTarget);
            if(a.hasClass("laydate_disabled")) return;
            let showDatetime = self._datatime.show;
            self.setMonth(showDatetime.getMonth() - 1);
        });
        months.find("> a:last").on("click", (e) => {
            let a = $(e.currentTarget);
            if(a.hasClass("laydate_disabled")) return;
            let showDatetime = self._datatime.show;
            self.setMonth(showDatetime.getMonth() + 1);
        });
        months.find("> input,> label").on("click", () => {
            if(months.find(".laydate_yms:visible").size() > 0) {
                months.find(".laydate_yms").css("display", "none");
            } else {
                months.find(".laydate_yms").css("display", "block");
            }
        });
        months.find("> .laydate_yms").on("mouseleave", () => {
            months.find(".laydate_yms").css("display", "none");
        });
        for(let i = 1; i <= 12;i++ ){
            let span = $("<span>").html(i + "月").appendTo(yms);
            span.on("click", (e) => {
                let span = $(e.target);
                if(span.hasClass("laydate_void") || span.hasClass("laydate_click")) return;
                months.find("> label").click();
                self.setMonth(parseInt($(e.target).html()) - 1);
            });
        }
    }
    initHeadMonthVal(){
        let months = this._datatime.$dom.find(".laydate_m");
        let yms = months.find(".laydate_yms");
        let showDatetime = this._datatime.show;
        let monthVal = showDatetime.getMonth() + 1;
        let minDatetime = new Date(this._option.min);
        let minMonth = minDatetime.getMonth() + 1;
        let maxDatetime = new Date(this._option.max);
        let maxMonth = maxDatetime.getMonth() + 1;
        months.find("> input").val(monthVal + "月");
        yms.find("> span").removeClass("laydate_click").each((index, data) => {
            let li = $(data);
            let thisMonth = parseInt(li.html());
            if(thisMonth == monthVal) {
                li.addClass("laydate_click");
            }
        });
        if(monthVal <= minMonth && minDatetime.getFullYear() == showDatetime.getFullYear()) {
            months.find("> a:first").addClass("laydate_disabled");
        } else {
            months.find("> a:first").removeClass("laydate_disabled");
        }
        if(monthVal >= maxMonth && maxDatetime.getFullYear() == showDatetime.getFullYear()) {
            months.find("> a:last").addClass("laydate_disabled");
        } else {
            months.find("> a:last").removeClass("laydate_disabled");
        }
        if(minDatetime.getFullYear() == showDatetime.getFullYear()) {
            yms.find("> span").each((index, data) => {
                let month = parseInt($(data).html());
                if(month < minMonth) {
                    $(data).addClass("laydate_void");
                } else if(month < maxMonth) {
                    $(data).removeClass("laydate_void");
                }
            });
        } else if(maxDatetime.getFullYear() == showDatetime.getFullYear()) {
            yms.find("> span").each((index, data) => {
                let month = parseInt($(data).html());
                if(month > maxMonth) {
                    $(data).addClass("laydate_void");
                } else if(month > minMonth) {
                    $(data).removeClass("laydate_void");
                }
            });
        } else {
            yms.find("> span").removeClass("laydate_void");
        }
    }
    setMonth(month) {
        this._datatime.show.setMonth(month);
        this.initShowVal();
    }
    initDay(){
        let self = this;
        let tbody = this._datatime.$dom.find(".laydate_table > tbody");
        let showDatetime = this._datatime.show;
        let showMonth = showDatetime.getMonth();
        let showYear = showDatetime.getFullYear();
        let minDatetime = new Date(this._option.min);
        let minMonth = minDatetime.getMonth();
        let minYear = minDatetime.getFullYear();
        let maxDatetime = new Date(this._option.max);
        let maxMonth = maxDatetime.getMonth();
        let maxYear = maxDatetime.getFullYear();
        let valueDatetime = this._datatime.value;
        let valueMonth = valueDatetime.getMonth();
        let valueYear = valueDatetime.getFullYear();
        let months = [31, null , 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let newDatetimeDay = (() => {
            let newDatetime = new Date();
            newDatetime.setFullYear(showDatetime.getFullYear(), showDatetime.getMonth(), 1);
            return newDatetime.getDay();
        })();
        months[1] = (0 === showYear % 4 && 0 !== showYear % 100 || 0 === showYear % 400) ? 29 : 28;
        let f = {
            ymd: [showDatetime.getFullYear(), showDatetime.getMonth(), showDatetime.getDate()],
            FDay: newDatetimeDay,
            PDay: months[0 === showMonth ? 11 : showMonth - 1] - newDatetimeDay + 1,
            NDay: 1
        };
        tbody.empty();
        for(let i = 0;i < 6; i++) {
            let tr = $("<tr>").appendTo(tbody);
            for(let t = 0; t < 7; t++) {
                let td = $("<td>").appendTo(tr);
                let index = tbody.find("td").size() - 1, otherYear = f.ymd[0], otherMonth = f.ymd[1] + 1, otherDay;
                if(index < f.FDay) {
                    otherDay = index + f.PDay;
                    if(1 === otherMonth) otherYear -= 1;
                    otherMonth = 1 === otherMonth ? 12 : otherMonth - 1;
                    td.addClass("laydate_nothis");
                    if(minMonth === showMonth && showYear === minYear) td.addClass("laydate_void");
                } else if(index >= f.FDay && index < f.FDay + months[f.ymd[1]]) {
                    otherDay = index - f.FDay + 1;
                    if(otherDay === f.ymd[2] && valueMonth === showMonth && valueYear === showYear) {
                        td.addClass("laydate_click");
                    }
                } else {
                    if(12 === otherMonth) otherYear += 1;
                    otherMonth = 12 === otherMonth ? 1 : otherMonth + 1
                    otherDay = f.NDay++;
                    td.addClass("laydate_nothis");
                    if(maxMonth === showMonth && showYear === maxYear) td.addClass("laydate_void");
                }
                td.html(otherDay).attr("year", otherYear).attr("month", otherMonth).attr("day", otherDay).on("click", (e) => {
                    let thisTd = $(e.target);
                    if(thisTd.hasClass("laydate_void") || thisTd.hasClass("laydate_click")) return;
                    valueDatetime.setFullYear(thisTd.attr("year"), parseInt(thisTd.attr("month")) - 1, parseInt(thisTd.attr("day")));
                    self.change("day");
                });
            }
        }
    }
    initHour() {
        let self = this;
        let hourDom = this._datatime.$dom.find(".hour");
        let hmsno = hourDom.find(".laydate_hmsno");
        let hourInput = this._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms input:eq(0)");
        let valueDatetime = this._datatime.value;
        for(let i = 0; i < 24; i++) {
            $("<span>").html(i).appendTo(hmsno).on("click", (e) => {
                let span = $(e.target);
                if(span.hasClass("laydate_click")) return;
                hourInput.click();
                let hour = parseInt(span.html());
                valueDatetime.setHours(hour);
                self.change("hours");
            });
        }
        hourInput.on("click", () => {
            if(hourDom.find(":visible").size()) {
                hourDom.css("display", "none");
            } else {
                hourDom.css("display", "block");
            }
        });
        hourDom.find(".laydte_hsmtex > span").on("click", () => {
            hourInput.click();
        });
    }
    initHourVal() {
        let hour = this._datatime.value.getHours();
        this._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms input:eq(0)").val(hour);
        this._datatime.$dom.find(".hour > .laydate_hmsno > span").removeClass("laydate_click").eq(hour).addClass("laydate_click");
    }
    initMinute(){
        let self = this;
        let minuteDom = this._datatime.$dom.find(".minute");
        let hmsno = minuteDom.find(".laydate_hmsno");
        let minuteInput = this._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms input:eq(1)");
        let valueDatetime = this._datatime.value;
        for(let i = 0; i < 60; i++) {
            $("<span>").html(i).appendTo(hmsno).on("click", (e) => {
                let span = $(e.target);
                if(span.hasClass("laydate_click")) return;
                minuteInput.click();
                let minute = parseInt(span.html());
                valueDatetime.setMinutes(minute);
                self.change("minutes");
            });
        }
        minuteInput.on("click", () => {
            if(minuteDom.find(":visible").size()) {
                minuteDom.css("display", "none");
            } else {
                minuteDom.css("display", "block");
            }
        });
        minuteDom.find(".laydte_hsmtex > span").on("click", () => {
            minuteInput.click();
        });
    }
    initMinuteVal() {
        let minute = this._datatime.value.getMinutes();
        this._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms input:eq(1)").val(minute);
        this._datatime.$dom.find(".minute > .laydate_hmsno > span").removeClass("laydate_click").eq(minute).addClass("laydate_click");
    }
    initSeconds(){
        let self = this;
        let secondsDom = this._datatime.$dom.find(".seconds");
        let hmsno = secondsDom.find(".laydate_hmsno");
        let secondsInput = this._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms input:eq(2)");
        let valueDatetime = this._datatime.value;
        for(let i = 0; i < 60; i++) {
            $("<span>").html(i).appendTo(hmsno).on("click", (e) => {
                let span = $(e.target);
                if(span.hasClass("laydate_click")) return;
                secondsInput.click();
                let seconds = parseInt(span.html());
                valueDatetime.setSeconds(seconds);
                self.change("seconds");
            });
        }
        secondsInput.on("click", () => {
            if(secondsDom.find(":visible").size()) {
                secondsDom.css("display", "none");
            } else {
                secondsDom.css("display", "block");
            }
        });
        secondsDom.find(".laydte_hsmtex > span").on("click", () => {
            secondsInput.click();
        });
    }
    initSecondsVal() {
        let seconds = this._datatime.value.getSeconds();
        this._datatime.$dom.find("> .laydate_bottom > ul.laydate_hms input:eq(2)").val(seconds);
        this._datatime.$dom.find(".seconds > .laydate_hmsno > span").removeClass("laydate_click").eq(seconds).addClass("laydate_click");
    }
    initShowVal() {
        let minDatetime = new Date(this._option.min);
        let maxDatetime = new Date(this._option.max);
        if(this._datatime.show < minDatetime) {
            this._datatime.show = minDatetime;
        } else if(this._datatime.show > maxDatetime){
            this._datatime.show = maxDatetime;
        }
        this.initHeadYearVal();
        this.initHeadMonthVal();
        this.initDay();
        this.initHourVal();
        this.initMinuteVal();
        this.initSecondsVal();
    }
    change() {
        this._datatime.show = new Date(this._datatime.value.getTime());
        this.initShowVal();
        if($.isFunction(this._change)) this._change(new Date(this._datatime.value.getTime()));
    }
    getDateTime() {
        let valueDateTime = this._datatime.value;
        let format = this._option.format;
        let date = {
            "M+": valueDateTime.getMonth() + 1,
            "d+": valueDateTime.getDate(),
            "H+": valueDateTime.getHours(),
            "m+": valueDateTime.getMinutes(),
            "s+": valueDateTime.getSeconds(),
            "q+": Math.floor((valueDateTime.getMonth() + 3) / 3),
            "S+": valueDateTime.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (valueDateTime.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
    show() {
        this._datatime.$dom.appendTo("body");
        this.setOffset();
    }
    hide() {
        this._datatime.$dom.detach();
    }
    getPosition() {
        let _$el = this._option.$el;
        let el = _$el[0];
        let elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            });
        }
        let elOffset = _$el.offset();
        let scroll = { scroll: _$el.scrollTop() };
        return $.extend({}, elRect, scroll, elOffset);
    }
    setOffset () {
        let $dom = this._datatime.$dom;
        let pos = this.getPosition();
        let marginTop = parseInt($dom.css('margin-top'), 10);
        let marginLeft = parseInt($dom.css('margin-left'), 10);

        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        $dom.offset({ top: pos.top + pos.height + marginTop, left: pos.left + marginLeft });
    }
}

export function install(Vue, option) {

    Vue.directive('datetime', {
        params: ['minDatetime', "maxDatetime", "formatDatetime"],
        bind() {
            let selfEl = this.el;
            let datetime = new Datetime(this.el, {
                change() {
                    $(selfEl).val(this.getDateTime());
                },
                isTodayBtn: this.modifiers.today,
                format: this.params.formatDatetime || "yyyy/MM/dd HH:mm:ss",
                min: this.params.minDatetime || "1900-03-01 00:00:00",
                max: this.params.maxDatetime || "2099-10-31 23:59:59",
                date: this.vm.$eval(this.expression) || new Date()
            });
        }
    });
}