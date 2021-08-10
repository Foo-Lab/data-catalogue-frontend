import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
    DatabaseOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import './AppMenu.scss';

const { SubMenu, Item } = Menu;

const menuItems = [
    {
        key: 'data-submenu',
        title: 'Data',
        icon: <DatabaseOutlined />,
        children: [
            {
                key: 'experiments',
                title: 'Experiments',
                link: '/experiments',
            },
            {
                key: 'samples',
                title: 'Samples',
                link: '/samples',
            },
        ],
    },
    {
        key: 'profile',
        title: 'Profile',
        icon: <UserOutlined />,
        link: '/profile'
    },
    {
        key: 'config-submenu',
        title: 'Configuration',
        icon: <SettingOutlined />,
        children: [
            {
                key: 'fileTypes',
                title: 'File Types',
                link: '/fileTypes',
            },
            {
                key: 'organisms',
                title: 'Organisms',
                link: '/organisms',
            },
            {
                key: 'sequencers',
                title: 'Sequencers',
                link: '/sequencers',
            },
            {
                key: 'sequencingProviders',
                title: 'Sequencing Providers',
                link: '/sequencingProviders',
            },
            {
                key: 'sequencingTypes',
                title: 'Sequencing Types',
                link: '/sequencingTypes',
            },
            {
                key: 'statuses',
                title: 'Statuses',
                link: '/statuses',
            },
        ],
    },
]

const AppMenu = () => {
    const history = useHistory();
    const [ selectedKeys, setSelectedKeys ] = useState([]);
    const [ openKeys, setOpenKeys ] = useState([]);

    useEffect(() => {
        const currentPath = (history.location.pathname).split('/')[1];
        setSelectedKeys([ currentPath ]);

        const openSubmenu = menuItems.find(i =>
            i.children && i.children.some(c => c.key === currentPath)
        );
        if (openSubmenu) {
            setOpenKeys([ openSubmenu.key ]);
        }
    }, [history.location.pathname]);

    const onSelect = ({ key }) => setSelectedKeys([ key ]);

    const onOpenChange = (keys) => {
        const newOpenKeys = keys.filter(k => !openKeys.includes(k));
        setOpenKeys(newOpenKeys)
    };

    const renderMenuItem = (item) => (
        <Item
            key={item.key}
            icon={item?.icon}
        >
            <Link to={item.link}>{item.title}</Link>
        </Item>
    );

    const renderSubMenu = (submenu) => (
        <SubMenu
            key={submenu.key}
            icon={submenu.icon}
            title={submenu.title}
        >
            {submenu.children.map(
                child => renderMenuItem(child)
            )}
        </SubMenu>
    );

    return (
        <div className='app-menu'>
            <Menu
                mode='inline'
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
            >
                {menuItems.map(item =>
                    item.children
                        ? renderSubMenu(item)
                        : renderMenuItem(item)
                )}
            </Menu>
        </div>
    );
};

export default AppMenu;
