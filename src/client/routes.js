import React, { Suspense } from 'react';
import {useRoutes} from 'react-router-dom';
import { dynamicLoad } from '../libs/chunkLoadingTrackerJs';
import Main from './main';

const Lazy = dynamicLoad(() => import(/* webpackChunkName: "Lazy" */ "./components/Lazy/Lazy.jsx"), 'Lazy');
const Lazy1 = dynamicLoad(() => import(/* webpackChunkName: "Lazy1" */ "./components/Lazy1/Lazy1.jsx"), 'Lazy1');
const Lazy2 = dynamicLoad(() => import(/* webpackChunkName: "Lazy2" */ "./components/Lazy2/Lazy2.jsx"), 'Lazy2');


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