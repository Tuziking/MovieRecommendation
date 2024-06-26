import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Dropdown, Menu, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Search } = Input;

const menu = (
    <Menu>
        <Menu.Item>
            <Link to="/account" style={{ textDecoration: "none" }}>
                {sessionStorage.getItem('username') || 'User'}
            </Link>
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
            fetch(`https://api.themoviedb.org/3/search/movie?query=${event.target.value}&api_key=4e44d9029b1270a757cddc766a1bcb63`)
                .then(res => res.json())
                .then(data => {
                    const results = data.results.slice(0, 10).map(movie => ({
                        id: movie.id,
                        title: movie.original_title
                    }));
                    setSuggestions(results);
                    setShowSuggestions(true);
                });
            // 查表，获取推荐
            // setSuggestions([{
            //     id: '823464',
            //     original_title: 'The Shawshank Redemption'
            // },
            // {
            //     id: '653346',
            //     title: 'The Godfather'
            // },
            // {
            //     id: '748783',
            //     title: 'The Dark Knight'
            // }]);
            // setShowSuggestions(true);
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

            </div>
            <div className='headerRight'>
                <Space size={30}>
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
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item key="1" onClick={() => navigate('/login')}>
                                            Sign In
                                        </Menu.Item>
                                        <Menu.Item key="2" onClick={() => navigate('/register')}>
                                            Sign Up
                                        </Menu.Item>
                                    </Menu>
                                }>
                                    <Avatar
                                        size={50}
                                        style={{
                                            backgroundColor: '#444444',
                                        }}
                                        icon={<UserOutlined />}
                                    />
                                </Dropdown>
                            </>
                        ) : (
                            <Dropdown overlay={menu}>
                                <Avatar size={50} src={process.env.PUBLIC_URL + '/logo192.png'} />
                            </Dropdown>
                        )}
                    </div>
                </Space>
            </div>
        </div>
    );
}

export default Header;