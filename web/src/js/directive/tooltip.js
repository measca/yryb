require("./scss/tooltip.scss");

class Tooltip {
    constructor({
            el = null,
            context = "",
            placement = "top",
            enabled = true,
            click = false,
            hover = false,
            focus = false
        } = {}) {
        this._$el = $(el);
        this._$tip = $(this.template);
        this.enabled = enabled;
        this.placement = placement;
        this.context = context;
        this.initAction({click, hover, focus});
    }

    //模板
    get template() {
        return `<div class="tooltip">
                    <div class="tooltip-arrow"></div>
                    <div class="tooltip-inner"></div>
                </div>`;
    }
    get arrow() {
        return this._$tip.find(".tooltip-arrow");
    }
    get inner () {
        return this._$tip.find(".tooltip-inner");
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
    }

    hide(){
        this._$tip.detach();
    }

    toggle() {
        if($("body").has(this._$tip).size() > 0) {
            this.hide();
        } else {
            this.show();
        }
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
    Vue.directive('tooltip', {
        params: ['tooltipVal'],
        bind: function(){
            const modifiers = this.modifiers;
            const expression = this.expression;
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
            let tip = new Tooltip({
                el: this.el,
                context: context,
                placement: placement,
                click: modifiers.click,
                hover: modifiers.hover,
                focus: modifiers.focus
            });
            this.el.__tip = tip;
            if(expression) {
                tip.context = this.vm.$eval(expression);
                this.vm.$watch(expression, (val) => {
                    tip.context = val;
                });
            } else if(this.params.tooltipVal){
                tip.context = this.params.tooltipVal;
            }
        }
    });
}

export default Tooltip;