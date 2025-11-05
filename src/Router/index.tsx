import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { RouterStatus, type _IReductRouter, type _IRouter, type TReductRouter, type TRouter } from "./type";
import { completeRouterConfig, formatRouterAddKey, getComponentsToRouter, resolvePath } from "./utils";

type TRouterIds = (string | number)[];

interface IRouterProviderProps {
    router: TRouter,
    children: ReactNode;
}

type TRouterContextValue = {
    routerIds: TRouterIds;
    setRouterIds: React.Dispatch<React.SetStateAction<TRouterIds>>;
    data: any;
    routerReduce: TReductRouter;
}

const RouterContext = createContext<TRouterContextValue>(null!);

const RouterProvider = (props: IRouterProviderProps) => {
    const router = [...props.router];
    const [routerIds, setRouterIds] = useState<TRouterIds>([]);
    const data = useRef<any>(null);
    const routerReduce = useMemo(() => {
        const nRouter = completeRouterConfig(router, "");
        const nfRouter = formatRouterAddKey(nRouter);
        return nfRouter
    }, [router]);

    return <RouterContext.Provider value={{ routerIds, setRouterIds, data, routerReduce }}>
        {props.children}
    </RouterContext.Provider>
}

interface IProps {
    router?: TReductRouter;
    level: number;
    children?: any;
}

function RouterItem(props: IProps) {
    const { router, level } = props;
    const { routerIds } = useContext(RouterContext);
    if (!router) return <></>;
    const currentPath = routerIds[level];
    const currentRouter = router?.[currentPath];
    const Layout = router?.[currentPath]?.components ?? (({ children }: any) => children ?? <></>);
    if (routerIds.length - 1 === level) {
        return <Layout />
    }

    return <Layout>
        <RouterItem router={currentRouter?.children} level={level + 1} />
    </Layout>
}

// 路由查找函数
const findRouter = (routerReduce: TReductRouter, routerIds: (string | number)[]): RouterStatus => {
    const [pathId, ...otherPaths] = routerIds;
    if (routerIds?.length === 1 && routerReduce[pathId] && !routerReduce[pathId]?.children) return RouterStatus.OK;
    if (!routerReduce[pathId]) return RouterStatus.NOT_FOUND;
    if (!otherPaths?.length || !routerReduce[pathId]?.children) {

        if (routerReduce[pathId]?.redirect) {
            routerReduce[pathId]?.redirect && _push(routerReduce[pathId]?.redirect);
            return RouterStatus.REDIRECT;
        }
        return RouterStatus.PARTIAL_MATCH;
    }
    return findRouter(routerReduce[pathId].children, otherPaths);
};

const Routers = () => {
    const { routerReduce, setRouterIds } = useContext(RouterContext);
    useEffect(() => {
        const onPopState = () => {
            const pathname = window.location.pathname;
            let _routerids = (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname)?.split('/');
            _routerids = _routerids.length > 1 ? _routerids.filter(_ => !!_) : _routerids;
            const routerStatus = findRouter(routerReduce, _routerids);
            if (routerStatus === RouterStatus.OK) setRouterIds(_routerids);
            else setRouterIds([routerStatus]);
        };
        onPopState()
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('popstate', onPopState);
        };
    }, []);

    return <RouterItem level={0} router={routerReduce} />
}

const _push = (url: string) => {
    console.log(resolvePath(url), 'resolvePath')
    window.history.pushState({}, '', resolvePath(url));

};


export function useNavigete() {
    const { data } = useContext(RouterContext);

    return {
        push: (url: string, state: any) => {
            _push(url)
            data.current = state;
        },
        state: data.current
    }
}

export default function Router(props: { router: TRouter }) {
    const { router } = props;
    return <RouterProvider router={[...router]}>
        <Routers />
    </RouterProvider>
}
