<style>
.focused-form .login-logo {
    text-align: center;
    display: block;
    margin-top: 120px;
    margin-bottom: 50px;
}
</style>
<template>
    <div class="container">
        <a class="login-logo">
            <img >
        </a>
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h2>登录系统</h2>
                    </div>
                    <div class="panel-body">
                        <form class="form-horizontal" v-validation @success="logon" onsubmit="return false;">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="input-group">
                                        <span class="input-group-addon">
                                            <i class="fa fa-envelope"></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="请输入邮箱" v-model="mail">
                                    </div>
                                    <p class="mt10 mb0 text-danger" v-show="!validation.model.mail.isChangePass">
                                        {{validation.model.mail.message}}
                                    </p>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <div class="clearfix">
                                    <button type="submit" class="btn btn-primary btn-block"
                                        :disabled="!validation.isPass">登录</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {login} from "../js/service/userService.js";
    import gritter from "../js/lib/gritter/gritter.js";
    export default {
        el: "#app",
        data(){
            return {
                mail: ""
            };
        },
        methods: {
            logon(){
                login(this.mail, (msg)=>{
                    location.href = "main.html";
                }, (msg)=>{
                    gritter(msg).error();
                });
            }
        },
        validation: {
            model: {
                mail: {
                    trim: true,
                    email: true,
                    maxlength: 20
                }
            }
        }
    }
</script>