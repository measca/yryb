require("./scss/popover.scss");

class Alert {
    constructor({
            el = null,
            context = "",
            placement = "top",
            enabled = true,
            yesCallback = () => {},
            noCallback = () => {}
        } = {}){
        this._$el = $(el);
        this._$tip = $(this.template);
        this.enabled = enabled;
        this.placement = placement;
        this.context = context;
        this.initAction({click: false, hover: false, focus: true});
        this._yesCallback = yesCallback;
        this._noCallback = noCallback;
    }

    get template() {
        return `<div class="popover">
                    <div class="arrow"></div>
                    <div class="popover-content"></div>
                    <div class="popover-foot">
                        <div class="row">
                            <div class="col-sm-6">
                                <button class="btn btn-success btn-sm btn-block">确定</button>
                            </div>
                            <div class="col-sm-6">
                                <button class="btn btn-default btn-sm btn-block">取消</button>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    get arrow() {
        return this._$tip.find(".arrow");
    }
    get inner () {
        return this._$tip.find(".popover-content");
    }
    // 显示内容
    get context(){
        return this._context;
    }
    set context(value){
        this._context = value;
        this.inner.html(this.context);
        if(this.context) {
            this.applyPlacement();
        } else {
            this.hide();
        }
    }
    // 显示方向
    get placement(){
        return this._placement;
    }
    set placement(value) {
        if(this._placement) {
            this._$tip.removeClass(this.placement);
        }
        this._placement = value;
        this._$tip.addClass(this.placement);
        this.applyPlacement();
    }
    // 是否启用
    get enabled(){
        return this._enabled;
    }
    set enabled(value){
        this._enabled = value;
    }

    initAction({click, hover, focus}) {
        let $el = this._$el;
        let self = this;
        if(click) {
            $el.on("click", () => {
                self.toggle();
            });
        }
        if(hover) {
            $el.on("mouseenter", () => {
                self.show();
            }).on("mouseleave", ()=>{
                if(focus) {
                    if($el.is(":focus")) {
                        return;
                    }
                }
                self.hide();
            });
        }
        if(focus) {
            $el.on("focusin", () => {
                self.show();
            }).on("focusout", ()=>{
                self.hide();
            });
        }
    }

    show(){
        if(!this.context || !this.enabled) {
            this.hide();
        } else {
            this._$tip.appendTo("body");
            this.applyPlacement();
        }
        this.initBtn();
    }

    hide(){
        let $tip = this._$tip;
        if($tip.find(".is-over").size() === 0) {
            this._$tip.remove();
        }
    }

    toggle() {
        if($("body").has(this._$tip).size() > 0) {
            this.hide();
        } else {
            this.show();
        }
    }

    initBtn() {
        let self = this;
        let $tip = self._$tip;
        $tip.find(".btn-success").on("click", function(e){
            self._yesCallback(e);
            $(this).removeClass("is-over");
            self.hide();
        })
        $tip.find(".btn-default").on("click", function(e){
            self._noCallback(e);
            $(this).removeClass("is-over");
            self.hide();
        });
        $tip.find(".btn-default,.btn-success")
        .on("mouseover", (e)=> {
            $(e.target).addClass("is-over");
        }).on("mouseout", (e)=> {
            $(e.target).removeClass("is-over");
        }).on("focusout", (e)=>{
            self.hide();
        });
    }

    applyPlacement (){
        let placement = this.placement;
        let offset = this.getCalculatedOffset();
        let $tip = this._$tip;
        let width = $tip[0].offsetWidth;
        let height = $tip[0].offsetHeight;

        let marginTop = parseInt($tip.css('margin-top'), 10);
        let marginLeft = parseInt($tip.css('margin-left'), 10);

        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        offset.top += marginTop;
        offset.left += marginLeft;

        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                });
            }
        }, offset), 0);

        let actualWidth = $tip[0].offsetWidth;
        let actualHeight = $tip[0].offsetHeight;

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }
        let isVertical = /top|bottom/.test(placement);
        let arrowDelta = isVertical ? width + actualWidth * -1 : height + actualHeight  * -1;
        let arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';
        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
    }

    getCalculatedOffset () {
        let $tip = this._$tip;
        let actualWidth = $tip[0].offsetWidth;
        let actualHeight = $tip[0].offsetHeight;
        let pos = this.getPosition();
        switch (this.placement) {
            case 'bottom':
                return { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 };
            case 'top':
                return { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 };
            case 'left':
                return { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth };
            case 'right':
                return { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
            default:
                return null;
        }
    }

    getPosition() {
        let _$el = this._$el;
        let el = this._$el[0];

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

    replaceArrow (delta, dimension, isVertical) {
        this.arrow
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    }
}

export function install(Vue, option) {

    Vue.directive('alert', {
        params: ['alertVal'],
        bind: function(){
            const modifiers = this.modifiers;
            const expression = this.expression;
            let yesCallback = () => {};
            let noCallback = () => {};
            let directives = this.el["_vue_directives"];
            let placement = "top";
            let context = "";
            if(modifiers.top) {
                placement = "top";
            } else if(modifiers.bottom) {
                placement = "bottom";
            } else if(modifiers.left) {
                placement = "left";
            } else if(modifiers.right) {
                placement = "right";
            }
            for (let i = 0, directive; directive = directives[i++];) {
                if (directive.name === "on" && directive.arg === "yes") {
                    yesCallback = (e) => {
                        directive.handler(e);
                    };
                } else if (directive.name === "on" && directive.arg === "no") {
                    noCallback = (e) => {
                        directive.handler(e);
                    };
                }
            }
            let tip = new Alert({
                el: this.el,
                context: context,
                placement: placement,
                yesCallback,
                noCallback
            });
            if(expression) {
                tip.context = this.vm.$eval(expression);
                this.vm.$watch(expression, (val) => {
                    tip.context = val;
                });
            } else if(this.params.alertVal){
                tip.context = this.params.alertVal;
            }
        }
    });
}