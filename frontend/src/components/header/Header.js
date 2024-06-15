import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Dropdown, Menu, Avatar } from 'antd';
const { Search } = Input;

const menu = (
    <Menu>
        <Menu.Item>
            {sessionStorage.getItem('username') ? sessionStorage.getItem('username') : 'User'}
        </Menu.Item>
        <Menu.Item onClick={() => {
            sessionStorage.clear();
            console.log('Logout');
            // 重定向到首页
            window.location.href = '/';
        }}>
            Logout
        </Menu.Item>
    </Menu>
);

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value) {
            // 这里是一个模拟的推荐搜索列表，你可能需要根据实际情况来获取推荐搜索列表
            // 查表，获取推荐
            setSuggestions([{
                id: '823464',
                title: 'The Shawshank Redemption'
            },
            {
                id: '653346',
                title: 'The Godfather'
            },
            {
                id: '748783',
                title: 'The Dark Knight'
            }]);
            setShowSuggestions(true);
        }
    }

    const handleSearch = (value) => {
        if (value) {
            // 查表，获取推荐
            console.log('Search:', value);
            navigate(`/movies/search?query=${value}`);
        }
    }

    const handleSuggestionClick = (title) => {
        setSearchTerm(title);
        setShowSuggestions(false);
    }

    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/"><img className="header__icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png" alt="" /></Link>
                <Link to="/movies/popular" style={{ textDecoration: "none" }}><span>Popular</span></Link>
                <Link to="/movies/top_rated" style={{ textDecoration: "none" }}><span>Top Rated</span></Link>
                <Link to="/movies/upcoming" style={{ textDecoration: "none" }}><span>Upcoming</span></Link>
                <div className="search-container">
                    <Search
                        placeholder="input search text"
                        size="large"
                        allowClear
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onSearch={value => handleSearch(value)}
                    />
                    {searchTerm && showSuggestions && (
                        <div className="suggestions">
                            {suggestions.map((suggestion, index) => (
                                <Link key={index} to={`/movie/${suggestion.id}`} style={{ textDecoration: "none" }} onClick={() => handleSuggestionClick(suggestion.title)}>
                                    <div>{suggestion.title}</div>
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
                            <Avatar size={50} src={process.env.PUBLIC_URL + '/logo192.png'} />
                        </Dropdown>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;