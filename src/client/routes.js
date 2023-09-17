import React, { Suspense } from 'react';
import {useRoutes} from 'react-router-dom';
import Main from './main';

const Lazy = React.lazy(() => import(/* webpackChunkName: "Lazy" */ "./components/Lazy/Lazy.jsx"));
const Lazy1 = React.lazy(() => import(/* webpackChunkName: "Lazy1" */ "./components/Lazy1/Lazy1.jsx"));
const Lazy2 = React.lazy(() => import(/* webpackChunkName: "Lazy2" */ "./components/Lazy2/Lazy2.jsx"));


const Routes = () => {
    const AppRoutes = useRoutes([
        {path: '/', element: <Main />},
        {path: '/lazy', element: (
            <Suspense fallback="loader">
                <Lazy />
            </Suspense>
        )},
        {path: '/lazy1', element: (
            <Suspense fallback="loader">
                <Lazy1 />
            </Suspense>
        )},
        {path: '/lazy2', element: (
            <Suspense fallback="loader">
                <Lazy2 />
            </Suspense>
        )}
    ]);

    return (
        <div>{AppRoutes}</div>
    )
}

export default Routes;