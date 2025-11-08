import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { RouterStatus, type _IReductRouter, type _IRouter, type TReductRouter, type TRouter } from "./type";
import { completeRouterConfig, formatRouterAddKey } from "./utils";

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
    onPopState: Function;
}

const RouterContext = createContext<TRouterContextValue>(null!);


const getNewTargetRouter = (historyIds: (string | number)[], redirect: string) => {
    if (redirect.startsWith('/')) {
        return [...redirect.slice(1, redirect.length).split("/")]
    } else {
        return [...historyIds, ...redirect.split('/').filter(Boolean)]
    }
}
// 路由查找函数
const findRouter = (routerReduce: TReductRouter, routerIds: (string | number)[], historyIds: (string | number)[], originRouterReduct: TReductRouter): { type: RouterStatus, pathIds: (string | number)[] } => {
    const [pathId, ...otherPaths] = routerIds;
    if (routerIds?.length === 1 && routerReduce[pathId] && !routerReduce[pathId]?.children && !routerReduce[pathId].redirect)
        return { type: RouterStatus.OK, pathIds: [...historyIds, pathId] };
    else if (!otherPaths?.length || !routerReduce[pathId]?.children) {
        if (routerReduce[pathId]?.redirect) {
            const newIds = getNewTargetRouter([...historyIds, pathId], routerReduce[pathId]?.redirect);
            return findRouter(originRouterReduct, newIds, [], originRouterReduct)
        }
        return { type: RouterStatus.PARTIAL_MATCH, pathIds: [...historyIds, pathId] };
    } else if (!routerReduce[pathId])
        return { type: RouterStatus.NOT_FOUND, pathIds: [...historyIds, pathId] };
    return findRouter(routerReduce[pathId].children, otherPaths, [...historyIds, pathId], originRouterReduct);
};

const RouterProvider = (props: IRouterProviderProps) => {
    const router = [...props.router];
    const [routerIds, setRouterIds] = useState<TRouterIds>([]);
    const data = useRef<any>(null);
    const routerReduce = useMemo(() => {
        const nRouter = completeRouterConfig(router);
        const nfRouter = formatRouterAddKey(nRouter);
        return nfRouter
    }, [router]);

    const onPopState = useCallback((url?: string) => {
        if (typeof url === undefined || url === null) return
        const pathname = window.location.pathname;
        const _routerids = getNewTargetRouter([...routerIds], url || pathname)
        const routerRes = findRouter(routerReduce, _routerids, [], routerReduce);
        console.log(routerRes, 'routerRes', _routerids)
        if (routerRes?.type === RouterStatus.OK) {
            setRouterIds(routerRes.pathIds);
        } else setRouterIds([routerRes?.type]);
        window.history.pushState({}, "", "/" + routerRes.pathIds.join("/"));
    }, []);
    useEffect(() => {
        const pathname = window.location.pathname;
        onPopState(pathname)
    }, []);

    return <RouterContext.Provider value={{ routerIds, setRouterIds, data, routerReduce, onPopState }}>
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



const Routers = () => {
    const { routerReduce, } = useContext(RouterContext);

    return <RouterItem level={0} router={routerReduce} />
}

export function useNavigete() {
    const { data, onPopState } = useContext(RouterContext);

    return {
        push: (url: string, state: any) => {
            onPopState(url)
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