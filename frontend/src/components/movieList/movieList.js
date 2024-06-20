import React, { useEffect, useState, useCallback } from "react"
import "./movieList.css"
import { useParams, useLocation } from "react-router-dom"
import Cards from "../card/card"
import httpService from "../../utils/httpService";

const MovieList = (props) => {

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
            if (props.type === "like") {
                // let idList = [1022789, 573435, 974635, 748783, 1041613, 882059, 1087388, 1086747, 519182, 1093995, 1146972, 1034751, 1012201, 856289, 1010600, 862, 8844, 15602, 31357, 11862, 949, 11860, 45325, 9091, 710, 9087, 12110, 31032, 10858, 1408, 524, 4584, 5];
                console.log("likeeee");
                httpService.get(`/movie/like`)
                    .then(res => {
                        let idList = res.data;
                        idList = idList.map(item => item.mid);
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
            } else if(!props.data) {
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
            } else {
                setMovieList(props.data);
            }
        }
        // 检查type，转入自己的API
        // if (type === "search") {
        // 原有API
        // fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
        //     .then(res => res.json())
        //     .then(data => setMovieList(data.results))
    }, [])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <div className="movie__list">
            <h2 className="list__title">{(type || props.type || 'MovieList').toUpperCase()}</h2>
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