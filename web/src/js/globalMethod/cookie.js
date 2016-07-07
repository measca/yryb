/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */

var pluses = /\+/g;

function encode(s) {
    return encodeURIComponent(s);
}

function decode(s) {
    return decodeURIComponent(s);
}

function stringifyCookieValue(value) {
    return encode(String(value));
}

function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
        // This is a quoted cookie as according to RFC2068, unescape...
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }
            try {
        // Replace server-side written pluses with spaces.
        // If we can't decode the cookie, ignore it, it's unusable.
        // If we can't parse the cookie, ignore it, it's unusable.
        s = decodeURIComponent(s.replace(pluses, ' '));
        return s;
    } catch (e) { }
}

function read(s, converter) {
    var value = parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
}

class Cookie {
    constructor(options = {}){
        this.options = options;
    }

    get(key, converter){
        var result = key ? undefined : {};
		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            if (key && key === name) {
            // If second argument (value) is a function it's a converter...
                result = read(cookie, converter);
                break;
            }
            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
		}
		return result;
    }

    set(key, value, options){
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, this.options, options);
            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }
            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
		}
    }

    remove(key, options){
        if (this.get(key) === undefined) {
            return false;
        }
        this.set(key, '', $.extend({}, options, { expires: -1 }));
        return !this.get(key);
    }
}

let cookie = new Cookie();

export function install(Vue) {
    Vue.cookie = cookie;
    Vue.prototype.$cookie = cookie;
}
export default cookie;