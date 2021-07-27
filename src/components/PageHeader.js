import React, { useEffect, useState } from 'react';
import { string, element } from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { PageHeader as AntdPageHeader } from 'antd';

import './PageHeader.scss';

const PageHeader = ({
    name,
    action,
    icon,
    backUrl,
    children,
}) => {
    const history = useHistory();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        const paths = (history.location.pathname)
            .split('/')
            .filter((p) => Number.isNaN(p))
            .map((p) => ({
                path: `/${p}`,
                breadcrumbName: p,
            }));

        setBreadcrumbs([
            {
                path: '/',
                breadcrumbName: 'Home',
            },
            ...paths,
        ]);
    }, [history.location.pathname]);

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
                backUrl
                    ? () => history.push(backUrl)
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
    backUrl: string,
    children: element,
};

PageHeader.defaultProps = {
    action: null,
    icon: null,
    backUrl: null,
    children: null,
};

export default PageHeader;
