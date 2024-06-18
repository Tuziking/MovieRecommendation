import React from 'react';
import './account.css';
import { Link, Outlet } from 'react-router-dom';
import { Avatar } from 'antd';

const AccountPage = () => {
    return (
        <div className="account__page">
            <div class="layout_content">
                <aside class="layout_aside">
                    <h2 className='like_title'>Account</h2>
                    <br />
                    <Avatar size={50} src={process.env.PUBLIC_URL + '/logo192.png'} />
                    <h3>{sessionStorage.getItem('username') || 'User'}</h3>
                    <br />
                    <Link to="/account/like" className='account_link' style={{ textDecoration: "none" }}>
                        Liked Movies
                    </Link>
                </aside>
                <main class="layout_main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AccountPage;