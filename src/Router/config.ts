import Layout from "../compomeents/Layout";
import ProjectManage from "../page/Project/Home";
import LocalChat from "../page/LocalChat/Home";
import type { TRouter } from "./type";
import ZiyeHome from "../page/Home";
import NotFound from "../page/404";

const router: TRouter = [{
    path: '/',
    components: ZiyeHome

}, {
    path: '/project',
    components: Layout,
    children: [
        { path: '/home', components: ProjectManage }
    ]
}, {
    path: '/localChat',
    redirect: '/home',
    children: [
        { path: '/home', components: LocalChat }
    ]
}, {
    path: '/404',
    components: NotFound
}];

export default router;