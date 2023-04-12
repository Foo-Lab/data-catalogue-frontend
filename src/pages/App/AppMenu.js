import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
    DatabaseOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import './AppMenu.scss';

// const { SubMenu, Item } = Menu;

const menuItems = [
    {
        key: 'data-submenu',
        label: 'Data',
        icon: <DatabaseOutlined />,
        children: [
            {
                key: '/experiments',
                label: 'Experiments',
            },
            {
                key: '/samples',
                label: 'Samples',
            },
        ],
    },
    {
        key: '/profile',
        label: 'Profile',
        icon: <UserOutlined />,
    },
    {
        key: 'config-submenu',
        label: 'Configuration',
        icon: <SettingOutlined />,
        children: [
            {
                key: '/fileTypes',
                label: 'File Types',
            },
            {
                key: '/organisms',
                label: 'Organisms',
            },
            {
                key: '/sequencers',
                label: 'Sequencers',
            },
            {
                key: '/sequencingProviders',
                label: 'Sequencing Providers',
            },
            {
                key: '/sequencingTypes',
                label: 'Sequencing Types',
            },
            {
                key: '/statuses',
                label: 'Statuses',
            },
        ],
    },
]

const AppMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);

    useEffect(() => {
        const currentPath = (location.pathname).split('/')[1];
        setSelectedKeys([currentPath]);

        const openSubmenu = menuItems.find(i =>
            i.children && i.children.some(c => c.key === currentPath)
        );
        if (openSubmenu) {
            setOpenKeys([openSubmenu.key]);
        }
    }, [location.pathname]);

    const onSelect = ({ key }) => setSelectedKeys([key]);

    const onOpenChange = (keys) => {
        const newOpenKeys = keys.filter(k => !openKeys.includes(k));
        setOpenKeys(newOpenKeys)
    };

    // const renderMenuItem = (item) => (
    //     <Item
    //         key={item.key}
    //         icon={item?.icon}
    //     >
    //         <Link to={item.link}>{item.label}</Link>
    //     </Item>
    // );

    // const renderSubMenu = (submenu) => (
    //     <SubMenu
    //         key={submenu.key}
    //         icon={submenu.icon}
    //         label={submenu.label}
    //     >
    //         {submenu.children.map(
    //             child => renderMenuItem(child)
    //         )}
    //     </SubMenu>
    // );

    return (
        <div className='app-menu'>
            <Menu
                mode='inline'
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
                items={menuItems}
                onClick={item => {
                    console.log(`nav to`, item)
                    navigate(item.key, { state: location.pathname })
                }}
            />
        </div>
    );
};

export default AppMenu;
