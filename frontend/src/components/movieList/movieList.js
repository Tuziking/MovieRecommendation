import React, { useEffect, useState, useCallback } from "react"
import "./movieList.css"
import { useParams, useLocation } from "react-router-dom"
import Cards from "../card/card"
import httpService from "../../utils/httpService";

const MovieList = () => {

    const [movieList, setMovieList] = useState([])
    const { type } = useParams()
    const queryOBJ = new URLSearchParams(useLocation().search)
    const { query } = Object.fromEntries(queryOBJ)

    const getData = useCallback(() => {
        //TODO是否登录
        if (!sessionStorage.getItem('token')) {
            if (type === "search") {
                fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=4e44d9029b1270a757cddc766a1bcb63`)
                    .then(res => res.json())
                    .then(data => setMovieList(data.results))
            } else {
                fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
                    .then(res => res.json())
                    .then(data => setMovieList(data.results))
            }
        } else {
            //先向后端发送请求，获取用户喜欢的电影
            httpService.get(`/movie`)
                .then(res => {
                    console.log(res);
                    const idList = res.data;
                    // 使用 Promise.all 并行处理所有请求
                    return Promise.all(
                        idList.map(id =>
                            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
                                .then(res => res.json())
                        )
                    );
                })
                .then(mList => {
                    // 所有请求完成后，一次性更新 movieList
                    setMovieList(mList);
                    console.log(mList);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        // 检查type，转入自己的API
        // if (type === "search") {
        // 原有API
        // fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
        //     .then(res => res.json())
        //     .then(data => setMovieList(data.results))
    }, [type, query])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <div className="movie__list">
            <h2 className="list__title">{(type ? type : "POPULAR").toUpperCase()}</h2>
            <div className="list__cards">
                {
                    movieList.map(movie => (
                        <Cards movie={movie} />
                    ))
                }
            </div>
        </div>
    )
}

export default MovieList