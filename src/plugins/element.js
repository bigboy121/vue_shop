import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'



// 全局注册使用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 导入弹框提示 需要全局挂载
Vue.prototype.$message = Message