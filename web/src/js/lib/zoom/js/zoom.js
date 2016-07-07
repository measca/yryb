require("../css/zoom.css");

if($("#zoom").size() < 1) {
    init();
}

var t = $("#zoom").hide()
    , n = $("#zoom .content")
    , r = '<div class="overlay"></div>'
    , i = false
    , s = []
    , o = $(window).width()
    , u = $(window).height()
    , showIndex = 0;

function init() {
    var zoom = $('<div id="zoom"><a class="close"></a><a href="javascript:;" class="previous"></a><a href="javascript:;" class="next"></a><div class="content loading"></div></div>');
    $("body").append(zoom);
    $("#zoom").on("click", function (even) {
        even.preventDefault();
        if ($(even.target).attr("id") == "zoom") {
            close();
        }
    });
    $("#zoom .close").on("click", close);
    $("#zoom .previous").on("click", previous);
    $("#zoom .next").on("click", next);
    $(document).keydown(function (even) {
        if (s.length === 0) {
            return
        }
        if (even.which == 38 || $.which == 40) {
            even.preventDefault()
        }
        if (even.which == 27) {
            close()
        }
        if (even.which == 37 && !s.hasClass("zoom")) {
            previous()
        }
        if (even.which == 39 && !s.hasClass("zoom")) {
            next()
        }
    });

    $(window).on("resize", resize)

    $(window).on("mousewheel DOMMouseScroll", function (even) {
        if (!i) {
            return
        }
        even.stopPropagation();
        even.preventDefault();
        even.cancelBubble = false
    });
}
function zoomImage(images, index) {
    function loadImg() {
        function loading(e) {
            e.show();
            n.removeClass("loading")
        }
        var t = $(this)
            , r = parseInt(n.css("borderLeftWidth"))
            , i = o - r * 2
            , s = u - r * 2
            , a = t.width()
            , f = t.height();
        if (a == n.width() && a <= i && f == n.height() && f <= s) {
            loading(t);
            return
        }
        if (a > i || f > s) {
            var l = s < f ? s : f
                , c = i < a ? i : a;
            if (l / f <= c / a) {
                t.width(Math.round(a * l / f));
                t.height(l)
            } else {
                t.width(c);
                t.height(Math.round(f * c / a))
            }
        }
        n.animate({
            width: t.width(),
            height: t.height(),
            marginTop: -(t.height() / 2) - r,
            marginLeft: -(t.width() / 2) - r
        }, 200, function () {
            loading(t)
        })
    }
    if (!images || !images.length || images.length < 1) {
        return;
    }
    if(!index || index >= images.length || index < 0){
        index = 0;
    }
    var l = images[index];
    var c = $(new Image).hide();
    $("#zoom .previous, #zoom .next").show();
    if (images.length <= 1) {
        $("#zoom .previous, #zoom .next").hide()
    }
    if (!i) {
        i = true;
        t.show();
        $("body").addClass("zoomed")
    }
    n.html(c).delay(500).addClass("loading");
    n.prepend(r);
    c.load(loadImg).attr("src", l);
    s = images;
    showIndex = index;
}
function previous() {
    showIndex = showIndex - 1;
    if (showIndex < 0) {
        showIndex = s.length - 1;
    }
    zoomImage(s, showIndex);
}
function next() {
    showIndex = showIndex + 1;
    if (showIndex >= s.length) {
        showIndex = 0;
    }
    zoomImage(s, showIndex);
}
function close(r) {
    if (r) {
        r.preventDefault()
    }
    i = false;
    s = [];
    showIndex = 0;
    t.hide();
    $("body").removeClass("zoomed");
    n.empty()
}
function resize() {
    o = $(window).width();
    u = $(window).height()
}

module.exports = function(images, index){
    var arr = [];
    if((images instanceof String) || (typeof images).toLowerCase() == 'string') {
        arr.push(images);
    } else {
        arr = images;
    }
    zoomImage(arr, index);
}