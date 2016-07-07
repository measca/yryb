<template>
    <div class="input-group">
        <span class="input-group-btn">
            <button type="button" class="btn btn-default" @click="value = parseFloat(value) - increase">
                -
            </button>
        </span>
        <span class="input-group-addon" v-if="leftText">{{leftText}}</span>
        <input type="text" class="form-control" v-model="value" number>
        <span class="input-group-addon" v-if="rightText">{{rightText}}</span>
        <span class="input-group-btn">
            <button type="button" class="btn btn-default" @click="value = parseFloat(value) + increase">
                +
            </button>
        </span>
    </div>
</template>
<script>
    module.exports = {
        props: {
            value: {
                type: Number,
                twoWay: true,
                default: 0
            },
            max: {
                type: Number
            },
            min: {
                type: Number
            },
            increase: {
                type: Number,
                default: 1
            },
            digit: {
                type: Number,
                default: 0
            },
            leftText: {
                type: String
            },
            rightText: {
                type: String
            }
        },
        watch: {
            value: {
                handler: function(value){
                    var re = /^[0-9]+[.]?[0-9]*$/;
                    if (re.test(value))
                    {
                        if(value < this.min) {
                            value = this.min;
                        }
                        if(value > this.max) {
                            value = this.max;
                        }
                        this.oldVal = parseFloat(value).toFixed(this.digit);
                    }
                    this.value = this.oldVal;
                    return this.oldVal;
                },
                immediate: true
            }
        },
        data: function() {
            return {
                oldVal: ''
            };
        }
    }
</script>