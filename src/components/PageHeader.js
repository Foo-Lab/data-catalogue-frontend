import React, { useEffect, useState } from 'react';
import { string, element, bool } from 'prop-types';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PageHeader as AntdPageHeader } from 'antd';

import { splitCamelCase } from '../utilities';

import './PageHeader.scss';

const PageHeader = ({
    name,
    action,
    icon,
    showBackButton,
    children,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        console.log('location', location)
        console.log('pathname', location.pathname)
        const paths = (location.pathname)
            .split('/')
            .filter((p) => p && !Number(p))
            .map((p) => ({
                path: `/${p}`,
                breadcrumbName: splitCamelCase(p),
            }));

        setBreadcrumbs([
            {
                path: '/',
                breadcrumbName: 'Home',
            },
            ...paths,
        ]);
    }, [location.pathname]);

    const renderBreadcrumb = (route, params, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;
        return (
            last
                ? <span>{route.breadcrumbName}</span>
                : <Link to={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>
        );
    };

    return (
        <AntdPageHeader
            className='page-header'
            title={name}
            subTitle={action}
            avatar={
                icon
                    ? {
                        icon,
                        size: 'large',
                        style: {
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: 'black',
                        },
                    }
                    : null
            }
            onBack={
                showBackButton
                    ? () => navigate(-1)
                    : null
            }
            breadcrumb={{
                routes: breadcrumbs,
                itemRender: renderBreadcrumb,
            }}
            extra={children}
        />
    );
};

PageHeader.propTypes = {
    name: string.isRequired,
    action: string,
    icon: element,
    showBackButton: bool,
    children: element,
};

PageHeader.defaultProps = {
    action: null,
    icon: null,
    showBackButton: true,
    children: null,
};

export default PageHeader;
