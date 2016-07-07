<style>
    .content-container {
        margin: auto;
        width: 100%;
    }
    
    .formatting-container {
        background-color: #f5f5f5;
        border-bottom: 1px solid #ccc;
        padding: 5px 12px;
    }
    
    .formatting-container .ql-active,
    .formatting-container button:hover {
        color: #008000;
        font-weight: bold;
    }
    
    .editor-container {
        height: 300px !important;
    }
    
    .editor-wrapper {
        border: 1px solid #aaa;
        box-shadow: 0 0 2px 2px #ddd;
    }
</style>
<template>
    <div class="content-container">
        <div class="editor-wrapper">
            <div v-el:toolbar class="toolbar formatting-container">
                <span class="ql-format-group">
                    <select title="Font" class="ql-font">
                        <option value="'宋体','SimSun'" selected>宋体</option>
                        <option value="'微软雅黑','Microsoft YaHei'">微软雅黑</option>
                        <option value="'楷体','楷体_GB2312','SimKai'">楷体</option>
                        <option value="'隶书','SimLi'">隶书</option>
                        <option value="'andale mono'">andale mono</option>
                        <option value="'arial','helvetica','sans-serif'" >arial</option>
                        <option value="'arial black','avant garde'">arial black</option>
                        <option value="'impact','chicago'">impact</option>
                        <option value="'sans-serif'">sans-serif</option>
                    </select>
                    <select title="Size" class="ql-size">
                        <option value="10px">10</option>
                        <option value="12px" selected>12</option>
                        <option value="16px">16</option>
                        <option value="18px">18</option>
                        <option value="24px">24</option>
                        <option value="32px">32</option>
                        <option value="48px">48</option>
                    </select>
                </span>
                <span class="ql-format-group">
                    <span title="Bold" class="ql-format-button ql-bold"></span>
                    <span class="ql-format-separator"></span>
                    <span title="Italic" class="ql-format-button ql-italic"></span>
                    <span class="ql-format-separator"></span>
                    <span title="Underline" class="ql-format-button ql-underline"></span>
                    <span class="ql-format-separator"></span>
                    <span title="Strikethrough" class="ql-format-button ql-strike"></span>
                </span>
                <span class="ql-format-group">
                    <select title="Text Color" class="ql-color">
                        <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)" selected=""></option>
                        <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
                        <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
                        <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
                        <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
                        <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
                        <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
                        <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)"></option>
                        <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
                        <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
                        <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
                        <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
                        <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
                        <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
                        <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
                        <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
                        <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
                        <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
                        <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
                        <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
                        <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
                        <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
                        <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
                        <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
                        <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
                        <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
                        <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
                        <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
                        <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
                        <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
                        <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
                        <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
                        <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
                        <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
                        <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
                    </select>
                    <span class="ql-format-separator"></span>
                    <select title="Background Color" class="ql-background">
                        <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"></option>
                        <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
                        <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
                        <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
                        <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
                        <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
                        <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
                        <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)" selected=""></option>
                        <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
                        <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
                        <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
                        <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
                        <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
                        <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
                        <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
                        <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
                        <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
                        <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
                        <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
                        <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
                        <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
                        <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
                        <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
                        <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
                        <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
                        <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
                        <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
                        <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
                        <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
                        <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
                        <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
                        <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
                        <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
                        <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
                        <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
                    </select>
                </span>
                <span class="ql-format-group">
                    <span title="List" class="ql-format-button ql-list"></span>
                    <span class="ql-format-separator"></span>
                    <span title="Bullet" class="ql-format-button ql-bullet"></span>
                    <span class="ql-format-separator"></span>
                    <select title="Text Alignment" class="ql-align">
                        <option value="left" label="Left" selected=""></option>
                        <option value="center" label="Center"></option>
                        <option value="right" label="Right"></option>
                        <option value="justify" label="Justify"></option>
                    </select>
                </span>
            </div>
            <div class="editor-container" v-el:quill-container></div>
        </div>
    </div>
</template>
<script>
    require("../../js/lib/quill/quill.snow.css");
    var Quill = require("../../js/lib/quill/quill.js");
    module.exports = {
        props:{
            html: {
                type: String,
                default: "",
                twoWay: true
            },
            text: {
                type: String,
                twoWay: true
            },
            textLength: {
                type: Number,
                default: 10,
                twoWay: true
            },
            disabled: {
                type: Boolean,
                default: false,
                twoWay: true
            }
        },
        watch:{
            "disabled": function(val){
                this.quill.editor.enable(!val);
                return val;
            }
        },
        data:function(){
            return {
                quill: null
            };
        },
        ready: function(){
            var ths = this;
            ths.quill = new Quill(ths.$els.quillContainer, {
                modules: {
                    toolbar: { container: ths.$els.toolbar }
                },
                theme: 'snow'
            }).on('text-change', function(delta, source) {
                if(ths.textLength && ths.textLength > 0){
                    var length = ths.quill.getLength() - 1;
                    ths.text = ths.quill.getText(0, ths.textLength);
                    ths.text += length > ths.text.length ? "..." : "";
                } else {
                    ths.text = ths.quill.getText();
                }
                ths.html = ths.quill.getHTML();
            });
            ths.quill.setHTML(ths.html);
            ths.quill.editor.enable(!ths.disabled);
        }
    }

</script>