import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { Input, Dropdown, Menu, Avatar } from 'antd';
const { Search } = Input;

const menu = (
    <Menu>
        <Menu.Item>
            {sessionStorage.getItem('username') ? sessionStorage.getItem('username') : 'User'}
        </Menu.Item>
        <Menu.Item onClick={() => {
            // sessionStorage.clear();
            console.log('Logout');
            // 这里你可以添加其他的操作，例如重定向到登录页面
        }}>
            Logout
        </Menu.Item>
    </Menu>
);

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // 这里是一个模拟的推荐搜索列表，你可能需要根据实际情况来获取推荐搜索列表
        setSuggestions(['823464', '823464', '823464']);
    }

    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/"><img className="header__icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png" alt="" /></Link>
                <Link to="/movies/popular" style={{ textDecoration: "none" }}><span>Popular</span></Link>
                <Link to="/movies/top_rated" style={{ textDecoration: "none" }}><span>Top Rated</span></Link>
                <Link to="/movies/upcoming" style={{ textDecoration: "none" }}><span>Upcoming</span></Link>
                <div className="search-container">
                    <Search placeholder="input search text" size="large" allowClear onChange={handleSearchChange} />
                    {searchTerm && (
                        <div className="suggestions">
                            {suggestions.map((suggestion, index) => (
                                <Link key={index} to={`/movie/${suggestion}`} style={{ textDecoration: "none" }}>
                                    <div>{suggestion}</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <div className="loginButton">
                    {!sessionStorage.getItem('token') ? (
                        <>
                            <Link to="/login" style={{ textDecoration: "none" }}><span>Sign In</span></Link>
                            <Link to="/register" style={{ textDecoration: "none" }}><span>Sign Up</span></Link>
                        </>
                    ) : (
                        <Dropdown overlay={menu}>
                            <Avatar src={process.env.PUBLIC_URL + '/logo192.png'} />
                        </Dropdown>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;