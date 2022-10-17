import Vue from 'vue';
import {
    Form,
    Button,
    Input,
    FormItem,
    Card,
    Message,
    Container,
    Header,
    Aside,
    Tooltip,
    Main,
    Row,
    Col,
    Menu,
    MenuItem,
    Pagination,
    Table,
    TableColumn,
    Switch,
    Submenu,
    Tag,
    MenuItemGroup,
    Breadcrumb,
    MessageBox,
    BreadcrumbItem,
    Tree,
    Select,
    Option,
    Dialog,
    Cascader
} from 'element-ui';
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox.confirm