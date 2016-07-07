<template>
  <section>
    <div class="notfoundpanel">
      <h1>401</h1>
      <h3>禁止在非登录状态下面浏览该页面!</h3>
      <h4>{{ timeNum }}秒后自动跳转到登录页面...<a href="login.html">立即登录</a></h4>
    </div>
  </section>
</template>
<script>
  module.exports = {
    data:function(){
      return {
        timeNum: 5
      }
    },
    ready:function(){
      var vm = this;
      setInterval(function (){
        vm.timeNum--;
        if(!vm.timeNum){
          location.href = "login.html";
        }
      }, 1000);
    }
  }
</script>