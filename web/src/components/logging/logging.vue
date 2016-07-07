<style lang="scss">
    .loading {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.5);
        background-image: url("./image/throbber.gif");
        background-repeat: no-repeat;
        background-position: center;
    }
</style>
<template>
    <div :class="class" v-if="show"></div>
</template>
<script>
    export default {
        props: {
            class: {
                type: String,
                default: "loading"
            },
            show: {
                type: Boolean,
                default: false,
                twoWay: true
            }
        }
    }
</script>