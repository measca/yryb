'use strict';

export function getPageName() {
    var u = location.pathname;
    var a = u.split(/\//);
    var m = a.pop().match(/(?:^|\/)($|[^\.]+)/);

    return m[1] ? m[1] : 'index';
}

export function getQuery(name) {
    var u = location.search.slice(1);
    var re = new RegExp(name + '=([^&\\s+]+)');
    var m = u.match(re);
    var v = m ? m[1] : '';

    return (v === '' || isNaN(v)) ? v : v - 0;
}

export function getHash(name) {
    var u = location.hash.slice(1);
    var re = new RegExp(name + '=([^&\\s+]+)');
    var m = u.match(re);
    var v = m ? m[1] : '';

    return (v === '' || isNaN(v)) ? v : v - 0;
}

export function parseUrl(url) {
    var a = document.createElement('a');

    a.href = (url || 'x.html');

    return {
        host: a.host,
        protocol: a.protocol
    };
}

export function serialize(obj) {
    var s = [];

    $.each(obj, function(k, v) {
        s.push(k + '=' + encodeURIComponent(v));
    });

    return s.join('&');
}
