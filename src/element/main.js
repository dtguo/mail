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
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Dialog
} from 'element-ui';
Vue.use(Tooltip)
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