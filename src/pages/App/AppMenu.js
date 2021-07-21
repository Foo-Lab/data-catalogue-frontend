import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
    DatabaseOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import './AppMenu.scss';

const { SubMenu, Item } = Menu;

const AppMenu = () => (
    <div className='app-menu'>
        <Menu mode='inline'>
            <SubMenu
                key='data-submenu'
                icon={<DatabaseOutlined />}
                title='Data'
            >
                <Item key='1'>
                    <Link to='/experiments'>Experiments</Link>
                </Item>
                <Item key='2'>
                    <Link to='/samples'>Samples</Link>
                </Item>
            </SubMenu>
            <Item key='3' icon={<UserOutlined />}>
                <Link to='/profile'>Profile</Link>
            </Item>
            <Item key='4' icon={<SettingOutlined />}>
                <Link to='/settings'>Settings</Link>
            </Item>
        </Menu>
    </div>
);

export default AppMenu;
