import {
    Alert, Aside,
    Breadcrumb,
    BreadcrumbItem, Button,
    Card,


















    Cascader,

























































































    Checkbox, CheckboxGroup, Col, Container,
    Dialog, Form, FormItem,
    Header, Input, Main,
    Menu,
    MenuItem,
    Message,



    MessageBox,


    Option, Pagination, Row,


    Select,



















    Step, Steps, Submenu,
    Switch,

    Table,
    TableColumn,



    TabPane, Tabs,

    Tag, Tooltip, Tree, Upload
} from 'element-ui'
import Vue from 'vue'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)



//全局挂载在Vue原型链上，访问$message，则有弹窗提示
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

