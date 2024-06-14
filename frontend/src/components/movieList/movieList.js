import React, { useEffect, useState, useCallback } from "react"
import "./movieList.css"
import { useParams } from "react-router-dom"
import Cards from "../card/card"
import httpService from "../../utils/httpService";

const MovieList = () => {

    const [movieList, setMovieList] = useState([])
    const [idList, setIdList] = useState([])
    const { type } = useParams()

    const getData = useCallback(() => {
        //TODO是否登录
        if(!sessionStorage.getItem('token')){
            console.log("未登录");
            fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
                .then(res => res.json())
                .then(data => setMovieList(data.results))
        }else {
            //先向后端发送请求，获取用户喜欢的电影
            httpService.get(`/movie`)
                .then(res => {
                    console.log(res);
                    setIdList(res.data);
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
    }, [type])

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