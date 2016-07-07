var Promise = require('mmPromise')
var rules = require('./rule.js')

function deleteDot(value) {
  if (value[0] === '.') { value = value.substring(1); }
  if (value[value.length - 1] === '.') { value = value.substring(0, key.length - 1); }
  return value
}

function Validation(form, vm, validationObj, validationVM, doms, success, error) {
  this.directiveModels = []
  this.doms = doms
  this.form = form
  this.vm = vm
  this.success = success
  this.error = error

  init(this, validationObj, validationVM)
  // 初始化
  function init(validate, validationObj, validationVM) {
    if (validate.form.tagName.toLowerCase() != 'form') {
      return
    }
    var doms = validate.doms
    var vm = validate.vm
    var directiveModels = validate.directiveModels
    validationVM.model = {};
    validationVM.isPass = true;
    validationVM.isChange = false;
    validationVM.reset = () => {
      validate.reset()
    }
    validationVM.initVal = ()=>{
      validate.initVal()
    }
    validationVM.validateAll = ()=>{
      validate.validateAll()
    }
    var baseAttrName = validationObj.baseAttrName || ''
    var validationModel = validationObj.model || {}
    var validationMssage = validationObj.message || {}
    for (var key in validationModel) {
      key = key.replace(baseAttrName, '')
      key = deleteDot(key)
      var model = validationModel[key] || {}
      var modelMessage = validationMssage[key] || {}
      var check = {
        isPass: true, // 是否通过
        isChangePass: true, // 更改是否通过
        isChange: false, // 内容是否被改变
        message: null
      }
      watchData(validationVM, directiveModels, check)
      validationVM.model[key] = check;
      var expression = baseAttrName + '.' + key
      expression = deleteDot(expression)
      var data = new DirectiveModel(vm, model, modelMessage, expression, check, validate.doms[expression])
      directiveModels.push(data)
    }
  }

  function watchData(vm, directiveModels, check) {
    var vm = vm
    var directiveModels = directiveModels;
    Object.defineProperty(check, "isPass", {
      get() {
        return check._isPass;
      },
      set(value){
        setTimeout(function () {
          var state = true
          $.each(directiveModels, function (i, v) {
            if (!v.check.isPass) {
              state = false
            }
          })
          vm.isPass = state;
        }, 0);
        check._isPass = value;
      }
    });
    Object.defineProperty(check, "isChange", {
      get() {
        return check._isChange;
      },
      set(value){
        setTimeout(function () {
          var state = false
          $.each(directiveModels, function (i, v) {
            if (v.check.isChange) {
              state = true
            }
          })
          vm.isChange = state;
        }, 0);
        check._isChange = value;
      }
    });
  }
}
Validation.prototype = {
  // 初始化表单数据
  reset: function () {
    $.each(this.directiveModels, function (i, v) {
      v.reset = true
      v.setVal(v.oldVal)
    })
  },
  // 初始化控件默认数据
  initVal: function () {
    $.each(this.directiveModels, function (i, v) {
      v.initChange()
    })
  },
  validateAll: function () {
    var validate = this
    var promise = $.map(this.directiveModels, function (v) {
      return v.validate()
    })
    Promise.all(promise).then(function (array) {
      var reasons = []
      for (var i = 0, data; data = array[i++];) {
        if (data.length > 0) {
          reasons.push(data)
        }
      }
      if (reasons.length === 0) {
        validate.success.call(validate.vm)
      } else {
        validate.error.call(validate.vm, reasons)
      }
    })
  }
}

function getMessage() {
  var rformat = /\\?{{([^{}]+)\}}/gm
  var data = this.data || {}
  return this.message.replace(rformat, function (_, name) {
    return data[name] == null ? '' : data[name]
  })
}

function DirectiveModel(vm, model, modelMessage, expression, check, doms) {
  this.doms = doms
  this.model = model
  this.modelMessage = modelMessage
  this.rules = []
  this.vm = vm
  this.expression = expression
  this.check = check
  this.oldVal = null
  this.reset = false

  // 初始化
  init(this)
  function init(dm) {
    $.each(dm.model, function (key, val) {
      if (rules[key]) {
        var rule = rules[key]
        dm.rules.push({
          name: key,
          rule: rule,
          value: val,
          message: dm.modelMessage[key],
          doms: dm.doms
        })
      }
    })
    dm.initChange()
    // 内容改变的时候进行验证
    dm.vm.$watch(dm.expression, function (newVal) {
      setTimeout(function () {
        dm.validate(dm.reset)
        dm.reset = false
      }, 0)
      return newVal
    })
    dm.validate(true)
  }
}
DirectiveModel.prototype = {
  // 验证成功调用的方法
  success: function () {
    this.check.isChangePass = true
    this.check.message = ''
    if (typeof this.model.success == 'function') {
      this.model.success()
    }
  },
  // 验证失败的时候调用
  error: function (err) {
    this.check.isChangePass = false
    this.check.message = err[0].getMessage()
    if (typeof this.model.error == 'function') {
      this.model.error(err)
    }
  },
  // 初始化数据
  initChange: function () {
    var value = this.getVal()
    if (value instanceof Array) {
      this.oldVal = $.extend([], value)
    } else if (typeof value === 'object') {
      this.oldVal = $.extend({}, value)
    } else {
      this.oldVal = this.getVal()
    }
    this.check.isChange = false
  },
  // 写入数据
  setVal: function (value) {
    this.vm.$set(this.expression, value)
  },
  // 获取数据
  getVal: function () {
    return this.vm.$get(this.expression)
  },
  // 初始化更改状态
  initChangeState: function () {
    var val = this.getVal()
    var oldVal = this.oldVal
    if (val instanceof Array) {
      if (oldVal.length != val.length) {
        this.check.isChange = true
      } else {
        var valState = false
        for (var i = 0, arrVal; arrVal = val[i++];) {
          var stat = false
          for (var l = 0, oldArrVal; oldArrVal = oldVal[l++];) {
            if (arrVal === oldArrVal) {
              stat = true
            }
          }
          if (!stat) {
            valState = true
            break
          }
        }
        this.check.isChange = valState
      }
    } else {
      this.check.isChange = !(this.oldVal == val)
    }
  },
  // 验证
  validate: function (isNotShowMsg) {
    var promises = []
    var dm = this
    $.each(dm.rules, function (index, val) {
      var resolve = null
      promises.push(new Promise(function (res) {
        resolve = res
      }))
      var next = function (state) {
        if (state) {
          // 验证成功
          resolve(true)
        } else {
          // 验证失败
          var reason = {
            'ruleName': val.name,
            'data': {
              value: val.value
            },
            'message': val.message || val.rule.message,
            'getMessage': getMessage
          }
          resolve(reason)
        }
      }
      var value = dm.getVal()
      var attrVal = val.value
      val.rule.action.call(val.doms, value, attrVal, next, dm)
    })
    var lastPromise = Promise.all(promises).then(function (array) {
      var reasons = []
      for (var i = 0, el; el = array[i++];) {
        if (typeof el === 'object') {
          reasons.push(el)
        }
      }
      if (reasons.length && !isNotShowMsg) {
        dm.error(reasons)
      } else if (!isNotShowMsg) {
        dm.success()
      }
      dm.check.isPass = !reasons.length
      // 验证内容是否改变
      dm.initChangeState()
      return reasons
    })
    dm.initChangeState()
    return lastPromise
  }
}

export function install(Vue) {
  Vue.directive('validation', {
    // 绑定数据
    bind: function () {
      // 处理 form
      var success = function () { }
      var error = function () { }
      var configName = 'validation'
      var formDirectives = this.el['_vue_directives'] || []
      $.each(formDirectives, function (index, directive) {
        var vm = directive.vm
        var name = directive.name
        var arg = directive.arg
        var expression = directive.expression
        if (name === 'on' && arg === 'success') {
          success = vm[expression]
        } else if (name === 'on' && arg === 'error') {
          error = vm[expression]
        } else if (name === 'bind' && arg === 'config') {
          configName = expression
        }
      })
      var doms = {}
      $(':text,:password,:radio,:checkbox,:file,select,textarea', this.el).each(function () {
        var el = this
        var directives = el['_vue_directives']
        if (directives) {
          for (var l = 0, directive; directive = directives[l++];) {
            if (directive.name === 'model') {
              if (!doms[directive.expression]) doms[directive.expression] = []
              doms[directive.expression].push(el)
            }
          }
        }
      })
      var validationObj = this.vm.$options[configName]
      var validationVM = {}
      var validation = new Validation(this.el, this.vm, validationObj, validationVM, doms, success, error)
      // Vue.util.defineReactive(this.vm, '$' + configName, validationVM);
      this.vm.$set(configName, validationVM);
      this.el['__validation'] = validation
      if (this.modifiers.notenter) {
        this.el.onkeydown = function (event) {
          var target, code, tag
          if (!event) {
            event = window.event
            target = event.srcElement
            code = event.keyCode
            if (code == 13) {
              tag = target.tagName
              if (tag == 'TEXTAREA') { return true; } else { return false; }
            }
          } else {
            target = event.target
            code = event.keyCode
            if (code == 13) {
              tag = target.tagName
              if (tag == 'INPUT') { return false; } else { return true; }
            }
          }
        }
      }
      // form 提交事件
      $(this.el).on('submit', function (e) {
        validation.validateAll()
        if (e && e.preventDefault) e.preventDefault(); else window.event.returnValue = false
        return false
      })
    }
  })
}
