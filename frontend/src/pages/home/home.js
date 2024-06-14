import React, { useEffect, useState } from "react"
import "./home.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList";
import httpService from "../../utils/httpService";
const Home = () => {

    const [popularMovies, setPopularMovies] = useState([])
    const [idList, setIdList] = useState([])
    useEffect(() => {
        // 先用用户喜欢的电影进行推荐，若没有再使用热门电影进行推荐
        // 用户喜欢的电影
        // fetch("https://api.themoviedb.org/3/movie/550")

        //TODO是否登录
        if(!sessionStorage.getItem('token')){
            console.log("未登录");
        }else {
            //先向后端发送请求，获取用户喜欢的电影
            httpService.get(`/movie`)
                .then(res => {
                    console.log(res);
                    setIdList(res.data);
                    let movieList = []
                    idList.map(id => {
                        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
                            .then((res) => {
                                movieList.append(res.json());
                            })
                        }
                    )
                    setPopularMovies(movieList);
                })
                .catch(err => {
                    console.log(err);
                });
        }

        // 热门电影
        // fetch("https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US")
        //     .then(res => res.json())
        //     .then(data => setPopularMovies(data.results))
        // console.log(popularMovies);
    }, [])

    return (
        <>
            <div className="poster">
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={500}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {
                        popularMovies.map(movie => (
                            <Link style={{ textDecoration: "none", color: "white" }} to={`/movie/${movie.id}`} >
                                <div className="posterImage">
                                    <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} alt="" />
                                </div>
                                <div className="posterImage__overlay">
                                    <div className="posterImage__title">{movie ? movie.original_title : ""}</div>
                                    <div className="posterImage__runtime">
                                        {movie ? movie.release_date : ""}
                                        <span className="posterImage__rating">
                                            {movie ? movie.vote_average : ""}
                                            <i className="fas fa-star" />{" "}
                                        </span>
                                    </div>
                                    <div className="posterImage__description">{movie ? movie.overview : ""}</div>
                                </div>
                            </Link>
                        ))
                    }
                </Carousel>
                <MovieList />
            </div>
        </>
    )
}

export default Home