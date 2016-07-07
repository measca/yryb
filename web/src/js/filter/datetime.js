var formatFn = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

//1 短时间，形如 (13:04:06)
function isTime(str) {
  var a = (str.toString()).match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
  if (a == null) { return false; }
  if (a[1] > 24 || a[3] > 60 || a[4] > 60) {
    return false
  }
  return true;
}
//2. 短日期，形如 (2008-07-22)
function strDateTime(str) {
  var r = (str.toString()).match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null) return false;
  var d = new Date(r[1], r[3] - 1, r[4]);
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
}
//3 长时间，形如 (2008-07-22 13:04:06)
function strDateTime(str) {
  var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  var r = (str.toString()).match(reg);
  if (r == null) return false;
  var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}

function datetime(value, format) {
  var date = null;
  if (value instanceof Date) {
    return formatFn.call(value, format);
  } else if (isTime(value)) {
    return value;
  } else if (strDateTime(value) || strDateTime(value)) {
    var date = new Date(value);
    return formatFn.call(date, format);
  } else if (/^[0-9]+.?[0-9]*$/.test(value)) {
    var date = new Date();
    date.setTime(value * 1000);
    return formatFn.call(date, format);
  }
  return value;
}

export function install(Vue, option) {
  Vue.filter('datetime', datetime);
}
export default datetime;