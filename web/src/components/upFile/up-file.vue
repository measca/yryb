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
  .name-sl {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .select-file-name-btn {
    max-width: 150px;
    width: auto;
    position: relative;
    overflow: hidden;
  }
  .upload-file-name-val {
    padding: 0;
    overflow: hidden;
  }
  .upload-file-name-val > a {
    position: absolute;
    z-index: 10;
    top: 8px;
    right: 13px;
    font-size: 15px;
  }
  .upload-file-name-val > input {
    border: 0 !important;
    padding-right: 35px;
    background-color: transparent !important;
  }
  .file-progress {
    position: absolute;
    top:0;
    left: 0;
    height: 100%;
  }
</style>
<template>
  <div class="input-group">
    <div class="form-control upload-file-name-val">
      <a href="javascript:;" class="fa fa-times-circle text-muted pull-right upload-file-name-clear-btn" v-if="file" v-alert="'确定要删除该文件吗?'" @yes="deleteUploadFile"></a>
      <input type="text" class="form-control" v-model="uploadFile.editName" :readonly="!isEdit" @click="editFileNameBefore" @blur="editFileNameAfter">
    </div>
    <div class="input-group-btn">
        <a type="button" class="btn btn-default select-file-name-btn name-sl" v-el:select-input>
          <div class="file-progress" v-el:progress :style="{'background-color': uploadState.state?'rgba(124,252,0,0.2)':'rgba(220,20,60,0.2)', 'width': uploadState.progress + '%'}" v-if="selectFile.name"></div>
          <i class="fa" :class="{ 'fa-file': selectFile.name, 'fa-folder-open': !selectFile.name}"></i> <span>{{selectFile.name || "浏览"}}</span>
          <div v-el:file-input v-show="!disabled && !readonly"></div>
        </a>
        <button type="button" class="btn btn-primary" :disabled="!selectFile.name || disabled || readonly" @click="upload" v-el:upload-input>
          <i class="fa" :class="{'fa-arrow-circle-up': !uploadState.isAgain, 'fa-undo':uploadState.isAgain}"></i>
          <span v-if="!uploadState.isAgain && !readonly">上传</span>
          <span v-if="!uploadState.isAgain && readonly">上传中...</span>
          <span v-if="uploadState.isAgain">重试</span>
        </button>
    </div>
  </div>
</template>
<script>
  import fileSize from "../../js/filter/fileSize.js";
  import gritter from "../../js/lib/gritter/gritter.js";
  var WebUploader = require("../../js/lib/webuploader-0.1.5/webuploader.withoutimage.js");
  var uploaderSwf = require("../../js/lib/webuploader-0.1.5/Uploader.swf");

  module.exports = {
    props:{
      "file": {
        twoWay: true,
        type: String
      },
      "size": {
        twoWay: true,
        type: Number
      },
      "disabled": {
        twoWay: true,
        type: Boolean
      },
      "maxsize": {
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
        selectFile: {
          size: 0, //文件大小
          name: "", //当前文件名称
          ext: "", //当前文件后缀
          $file: null //当前文件
        },
        uploadFile: {
          $file: null,
          editName: "", //编辑文件名称
          ext: "", //后缀
          fileName: ""
        },
        uploadState: {
          progress: 0,
          isAgain: false,
          state: true
        },
        isEdit: false,
        readonly: false,
        uploader: null
      };
    },
    methods: {
      editFileNameBefore: function(){
        if(this.file && !this.isEdit && !this.disabled && !this.readonly) {
          var name = this.file || "";
          var dotIndex = name.lastIndexOf(".");
          if(dotIndex >= 0 && this.uploadFile.ext){
            this.uploadFile.editName = name.substring(0,name.lastIndexOf("."));
          } else {
            this.uploadFile.editName = name;
          }
          this.isEdit = true;
        }
      },
      editFileNameAfter: function(){
        if(this.uploadFile.editName.trim() && this.isEdit) {
          this.file = this.uploadFile.ext?this.uploadFile.editName + "." + this.uploadFile.ext:this.uploadFile.editName;
          var fileName = this.file + (this.size && this.size > 0?"(" + fileSize(this.size) + ")":"");
          this.uploadFile.editName = this.uploadFile.fileName = fileName;
          this.isEdit = false;
        } else if(this.isEdit) {
          this.uploadFile.editName = this.uploadFile.fileName;
          this.isEdit = false;
        }
      },
      deleteUploadFile: function(){
        if(this.disabled || this.readonly) return;
        this.initUploadFile();
      },
      initUploadFile: function (){
        this.uploadFile = {
          $file: null,
          editName: "", //编辑文件名称
          ext: "", //后缀
          fileName: ""
        };
        this.file = "";
        this.size = 0;
      },
      initSelectFile: function(){
        this.selectFile = {
          size: 0,
          name: "", //当前文件名称
          ext: "", //当前文件后缀
          $file: null //当前文件
        };
      },
      setSelectFile: function(file){
        this.uploadState.progress = 0;
        this.selectFile = {
          size: file.size,
          name: file.name,
          ext: file.ext,
          $file: file
        };
      },
      setUploadFile: function(){
        var fileName = this.selectFile.name + "(" + fileSize(this.selectFile.size) + ")";
        this.uploadFile = {
          $file: this.selectFile.$file,
          ext: this.selectFile.ext,
          fileName: fileName,
          editName: fileName
        };
        this.file = this.selectFile.name;
        this.size = this.selectFile.size;
      },
      upload: function() {
        if(this.uploadState.isAgain){
          this.uploader.retry();
        } else {
          this.uploader.upload();
        }
      }
    },
    ready: function(){
      var ths = this;
      if(ths.file) {
        var dotIndex = ths.file.lastIndexOf(".");
        ths.uploadFile.ext = dotIndex >= 0?ths.file.substring(ths.file.lastIndexOf(".") + 1) : "";
        var fileName = ths.file + (ths.size && ths.size > 0?"(" + fileSize(ths.size) + ")":"");
        ths.uploadFile.editName = ths.uploadFile.fileName = fileName;
      }
      var option = {
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

      var uploader = null;
      uploader = ths.uploader = WebUploader.create(option);
      uploader.on('beforeFileQueued', function(file) {
          ths.uploadState.isAgain = false;
          uploader.reset();
          return true;
      });
      uploader.on('fileQueued', function(file) {
          ths.setSelectFile(file);
      });
      uploader.on('error', function(e) {
        switch(e){
          case "Q_TYPE_DENIED":
            gritter("非法文件格式", "文件:").error();
          break;
          case "F_EXCEED_SIZE":
            gritter("文件不能大于" + fileSize(ths.maxsize), "文件:").error();
          break;
        }
        var files = uploader.getFiles();
        if(files.length > 0){
          var file = files[i];
          ths.setSelectFile(file);
        } else {
          ths.initSelectFile();
        }
      });
      uploader.on('startUpload', function(file, reason) {
        ths.readonly = true;
        ths.uploadState = {
          isAgain: false,
          progress: 0,
          state: true
        };
      });
      uploader.on('uploadComplete', function(file, reason) {
        ths.readonly = false;
      });
      uploader.on('uploadProgress', function(file, percentage) {
        var width = percentage.toFixed(2) * 100;
        ths.uploadState.progress = width;
      });
      uploader.on('uploadError', function(file, reason) {
        ths.uploadState.state = false;
        ths.uploadState.isAgain = true;
        if(typeof ths.sendError === "function") {
          ths.sendError(reason);
        }
      });
      uploader.on('uploadSuccess', function(file, response) {
        ths.uploadState.state = true;
        ths.setUploadFile();
        ths.initSelectFile();
        ths.uploader.reset();
        if(typeof ths.sendSuccess === "function") {
          ths.sendSuccess(response);
        }
      });
    }
  }

</script>