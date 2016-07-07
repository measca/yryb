<style>
    .webuploader-container input,.webuploader-container :not(.webuploader-pick) {
        font-size:1000px;
        position: absolute;
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 10;
        opacity: 0;
    }
    .webuploader-container > div{
        width: 100% !important;
        height: 100% !important;
    }
    .files-table-info-th {
        width: 12px;
    }
    .files-table-th {
        width: 100px;
    }
    .select-files-name{
        overflow: hidden;
        position: relative;
    }
    .padding-3 {
        padding-top: 3px;
        padding-bottom: 3px;
    }
    .name-sl {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .files-list {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
    }
    .files-list .list-group-item {
        position: relative;
    }
    .files-head {
        padding-left: 15px;
        padding-right: 15px;
        background-color: #d8dce3 !important;
    }
    .files-input-name {
        border: 0px;
        background-color: transparent;
        outline: none;
    }
    .files-progress {
        width: 0%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
    }
    .files-info {
        font-size: 14px;
    }
    .files-footer{
        padding: 10px 20px;
    }

    .files-options {
        list-style: none;
        margin: 0;
        padding: 0;
        text-align: center;
    }
    .files-options > li {
        display: inline-block;
        margin-left: 5px;
    }
    .files-options > li:first-child {
        margin-left: 0;
    }
    .files-options > li > a {
        color: #9fa8bc;
        font-size: 14px;
        line-height: 0;
        -webkit-transition: all 0.2s ease-out 0s;
        -o-transition: all 0.2s ease-out 0s;
        transition: all 0.2s ease-out 0s;
    }
    .files-options > li > a > i {
        line-height: 0;
    }
    .files-options > li > a:hover,
    .files-options > li > a:focus {
        color: #657390;
    }
</style>
<template>
    <div class="panel panel-default">
        <div class="panel-heading files-head">
            <div class="row">
                <div class="col-xs-1 col-sm-1"></div>
                <div class="col-xs-6 col-sm-6">文件 <span v-if="files.length > 0">({{files.length}})</span></div>
                <div class="col-xs-3 col-sm-3 text-center">大小 <span v-if="filesSizeCount > 0">({{filesSizeCount | fileSize}})</span></div>
                <div class="col-xs-2 col-sm-2 text-center">操作</div>
            </div>
        </div>
        <div class="list-group files-list">
            <div class="list-group-item" v-for="file in files">
                <div class="row">
                    <div class="files-progress" :style="{'width': file.progress + '%', 'background-color': file.state === 'error'?'rgba(220,20,60,0.2)':'rgba(124,252,0,0.2)'}"></div>
                    <div class="col-xs-1 col-sm-1 text-center files-info">
                        <a href="javascript:;" class="fa fa-file text-info" v-popover.hover="'等待上传'" v-if="file.state === 'inited'"></a>
                        <a href="javascript:;" class="fa fa-check-circle text-success" v-popover.hover="'上传成功'" v-if="file.state === 'complete'"></a>
                        <a href="javascript:;" class="fa fa-clock-o text-muted" v-popover.hover="'已经进入队列'" v-if="file.state === 'queued'"></a>
                        <a href="javascript:;" class="fa fa-times-circle text-danger" v-popover.'hover="上传失败'" v-if="file.state === 'error'"></a>
                        <a href="javascript:;" class="fa fa-arrow-circle-up text-primary" v-popover.hover="'正在上传'" v-if="file.state === 'progress'"></a>
                    </div>
                    <input type="text" class="col-xs-6 col-sm-6 files-input-name" v-model="file.fileName" :readonly="!file.isEdit" @click="editFileNameBefore(file)" @blur="editFileNameAfter(file)">
                    <div class="col-xs-3 col-sm-3 text-center">{{file.size | fileSize}}</div>
                    <div class="col-xs-2 col-sm-2 text-center">
                        <ul class="files-options" >
                            <li><a href="javascript:;" class="fa fa-undo" @click="againFile(file)" v-if="file.state === 'error'"></a></li>
                            <li v-alert="'确定要删除该文件吗?'" @yes="deleteFile(file)">
                                <a href="javascript:;" class="fa fa-trash" v-if="file.state != 'progress'"></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-footer files-footer">
            <div class="row">
                <div class="col-xs-6 col-sm-6" style="padding: 5px;">
                    <span v-if="maxsize && maxsize > 0">文件大小限制 {{maxsize | fileSize}} </span>
                </div>
                <div class="col-xs-3 col-sm-3 text-center">
                    <a class="btn btn-default btn-sm btn-block">
                        <i class="fa fa-folder-open"></i> 选择
                        <span v-if="countLimit && countLimit > 0">({{countLimit - files.length}})</span>
                        <div v-el:file-input v-show="(!countLimit || countLimit - files.length > 0) && !disabled"></div>
                    </a>
                </div>
                <div class="col-xs-3 col-sm-3 text-center">
                    <button type="button" class="btn btn-success btn-sm btn-block" :disabled="!existsInited || disabled" @click="upFileload">
                        <i class="fa fa-file"></i> 上传
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    var fileSize = require("../../js/filter/fileSize.js");
    var WebUploader = require("../../js/lib/webuploader-0.1.5/webuploader.withoutimage.js");
    var uploaderSwf = require("../../js/lib/webuploader-0.1.5/Uploader.swf");

    module.exports = {
        props: {
            "filesData": {
                twoWay: true,
                type: Array,
                default: []
            },
            "fileAttr": {
                type: String,
                default: "file",
                coerce: function (val){
                    if(!val) return "file";
                    return val;
                }
            },
            "sizeAttr": {
                type: Number,
                default: "size",
                coerce: function (val){
                    if(!val) return "szie";
                    return val;
                }
            },
            "disabled": {
                twoWay: true,
                type: Boolean
            },
            "maxsize": {
                type: Number
            },
            "countLimit": {
                type: Number
            },
            "accept": {
                // title: 'Images'
                // extensions: 'gif,jpg,jpeg,bmp,png'
                // mimeTypes: 'image/*'
                type: [Object, Array]
            },
            "sendData": {
                type: [Object, String]
            },
            "sendType": {
                type: String
            },
            "sendUrl": {
                type: String
            },
            "sendSuccess": {
                type: Function
            },
            "sendError": {
                type: Function
            }
        },
        data: function (){
            return {
                filesSizeCount: 0,
                files: [],
                uploader: null,
                existsInited: false
            };
        },
        watch:{
            "files": {
                handler: function (val){
                    this.filesSizeCount = 0;
                    var existsInited = false;
                    for(var i = 0,file; file = this.files[i++];){
                        this.filesSizeCount += file.size;
                        if(file.state === "inited") existsInited = true;
                    }
                    this.existsInited = existsInited;
                    return val;
                },
                immediate: true
            },
            "filesData": {
                handler: function (datas) {
                    for(var i = 0,data; data = datas[i++];){
                        var state = true;
                        for(var l = 0,file; file = this.files[l++];){
                            if(data == file.$data) state = false;
                        }
                        if(state){
                            var name = data[this.fileAttr];
                            var dotIndex = name.lastIndexOf(".");
                            var ext = "";
                            if(dotIndex >= 0){
                                ext = name.substring(dotIndex + 1);
                            }
                            var file = {
                                $file: null,
                                $data: data,
                                name: name,
                                size: data[this.sizeAttr],
                                ext: ext,
                                fileName: name,
                                state: "complete",
                                progress: 0,
                                isEdit: false
                            };
                            this.files.push(file);
                        }
                    }
                    return datas;
                },
                immediate: true
            }
        },
        methods: {
            getFileAtFile: function(uploadFile){
                for(var i = 0, file; file = this.files[i++];){
                    if(file.$file == uploadFile) {
                        return file;
                    }
                }
            },
            againFile: function(file){
                if(this.disabled) return;
                this.uploader.retry(file.$file);
            },
            editFileNameBefore: function(file){
                if(this.disabled) return;
                if(!file.isEdit && file.state === 'complete'){
                    var dotIndex = file.name.lastIndexOf(".");
                    if(dotIndex >= 0 && file.ext){
                        file.fileName = file.name.substring(0, dotIndex);
                    } else {
                        file.fileName = file.name;
                    }
                    file.isEdit = true;
                    file.progress = 0;
                }
            },
            editFileNameAfter: function(file){
                if(!file.isEdit) return;
                file.isEdit = false;
                if(file.fileName.trim()){
                    if(file.ext) {
                        file.name = file.fileName + "." + file.ext;
                    } else {
                        file.name = file.fileName;
                    }
                }
                file.fileName = file.name;
                if(file.$data) {
                    file.$data[this.fileAttr] = file.name;
                    file.$data[this.sizeAttr] = file.size;
                }
            },
            deleteFile: function(file){
                if(this.disabled) return;
                if(file.$file) {
                    file.$file.setStatus("cancelled", "文件被移除");
                    this.uploader.removeFile(file.$file, true);
                }
                if(file.$data){
                    this.filesData.$remove(file.$data);
                }
                this.files.$remove(file);
            },
            upFileload: function(){
                this.existsInited = false;
                for(var i = 0,file; file = this.files[i++];){
                    if(file.state === "inited") {
                        file.state = "queued";
                        this.uploader.upload(file.$file);
                    }
                }
            }
        },
        ready: function(){
            var ths = this;
            var option = {
                multiple: true,
                // swf文件路径
                swf: uploaderSwf,
                // 文件接收服务端。
                server: ths.sendUrl,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: ths.$els.fileInput
            };
            if(ths.maxsize && ths.maxsize > 0){
                option.fileSingleSizeLimit = ths.maxsize;
            }
            if(ths.accept){
                option.accept = ths.accept;
            }
            if(ths.sendType){
                option.method = ths.sendType;
            }
            if(ths.sendData){
                option.formData = ths.sendData;
            }
            if(ths.countLimit && ths.countLimit > 0){
                option.fileNumLimit = ths.countLimit;
            }
            var uploader = null;
            uploader = ths.uploader = WebUploader.create(option);
            uploader.on('fileQueued', function(file) {
                ths.files.push({
                    $file: file,
                    $data: null,
                    name: file.name,
                    size: file.size,
                    ext: file.ext,
                    fileName: file.name,
                    state: "inited",
                    progress: 0,
                    isEdit: false
                });
            });
            uploader.on('beforeFileQueued', function(uploadFile) {
                return !ths.countLimit || ths.countLimit - ths.files.length > 0;
            });
            uploader.on('uploadStart', function(uploadFile) {
                var file = ths.getFileAtFile(uploadFile);
                file.state = "progress";
                file.progress = 0;
            });
            uploader.on('uploadSuccess', function(uploadFile, response) {
                var file = ths.getFileAtFile(uploadFile);
                var data = {};
                data[ths.fileAttr] = uploadFile.name;
                data[ths.sizeAttr] = uploadFile.size;
                file.state = "complete";
                file.$data = data;
                ths.filesData.push(data);
                if(typeof ths.sendSuccess === "function"){
                    ths.sendSuccess(data, response);
                }
            });
            uploader.on('uploadError', function(uploadFile) {
                ths.getFileAtFile(uploadFile).state = "error";
            });
            uploader.on('uploadProgress', function(uploadFile, percentage) {
                ths.getFileAtFile(uploadFile).progress = percentage.toFixed(2) * 100;
            });
        }
    }
</script>