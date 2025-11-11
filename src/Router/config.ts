import Layout from "../compomeents/Layout";
import ProjectManage from "../page/Project/Home";
import LocalChat from "../page/LocalChat/Home";
import type { TRouter } from "./type";
import NotFound from "../page/404";
import Test1 from "../page/Test/test1";
import Test2 from "../page/Test/test2";
import ZiyeHome from "../page/Home";
import ImageHome from "../page/Image/Home";

const router: TRouter = [{
    path: '/',
    components: ZiyeHome,
}, {
    path: '/test1',
    components: Test1,
}, {
    path: '/test2',
    components: Test2
}, {
    path: '/project',
    components: Layout,
    redirect: "home",
    children: [
        { path: '/home', components: ProjectManage }
    ]
}, {
    path: '/localChat',
    redirect: 'home',
    children: [
        { path: '/home', components: LocalChat }
    ]
}, {
    path: '/image',
    redirect: 'home',
    children: [
        { path: '/home', components: ImageHome }
    ]
}, {
    path: '/404',
    components: NotFound
}];

export default router;