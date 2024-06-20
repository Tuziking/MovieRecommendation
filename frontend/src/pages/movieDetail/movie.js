import React, { useEffect, useState, useCallback } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import httpService from "../../utils/httpService";

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [liked, setLiked] = useState(false); // 新增状态来跟踪点赞状态
    const { id } = useParams();

    const getData = useCallback(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then((res) => res.json())
            .then((data) => setMovie(data));
    }, [id]);

    // const get

    useEffect(() => {
        getData();
        window.scrollTo(0, 0);
    }, [getData]);

    const handleLike = () => {
        if (!liked) {
            // 点赞
            httpService.post(`/movie/${id}/like`).catch(err => {
                console.log(err);
            });
        } else {
            // 取消点赞
            httpService.delete(`/movie/${id}/like`).catch(err => {
                console.log(err);
            });
        }
        setLiked(!liked); // 切换点赞状态
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img
                    className="movie__backdrop"
                    src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`}
                    alt=""
                />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img
                            className="movie__poster"
                            src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`}
                            alt=""
                        />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">
                            {currentMovieDetail ? currentMovieDetail.original_title : ""}
                        </div>
                        <div className="movie__tagline">
                            {currentMovieDetail ? currentMovieDetail.tagline : ""}
                        </div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average : ""}{" "}
                            <i className="fas fa-star" />
                            <span className="movie__voteCount">
                                {currentMovieDetail
                                    ? "(" + currentMovieDetail.vote_count + ") votes"
                                    : ""}
                            </span>
                        </div>
                        <div className="movie__runtime">
                            {currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}
                        </div>
                        <div className="movie__releaseDate">
                            {currentMovieDetail
                                ? "Release date: " + currentMovieDetail.release_date
                                : ""}
                        </div>
                        <div className="movie__genres">
                            {currentMovieDetail && currentMovieDetail.genres
                                ? currentMovieDetail.genres.map((genre) => (
                                    <span className="movie__genre" id={genre.id}>
                                        {genre.name}
                                    </span>
                                ))
                                : ""}
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                </div>
            </div>
            <div className="movie__links">
                {sessionStorage.getItem('token') && currentMovieDetail && (
                    <div
                        className={`movie__likeButton movie__Button ${liked ? "liked" : ""}`}
                        onClick={handleLike}
                    >
                        <p>
                            <span>
                                {liked ? "liked" : "like"} <i className="fas fa-thumbs-up"></i>
                            </span>
                        </p>
                    </div>
                )}
                {currentMovieDetail && currentMovieDetail.imdb_id && (
                    <a
                        href={"https://www.imdb.com/title/" + currentMovieDetail.imdb_id}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none" }}
                    >
                        <p>
                            <span className="movie__imdbButton movie__Button">
                                IMDb <i className="newTab fas fa-external-link-alt"></i>
                            </span>
                        </p>
                    </a>
                )}
            </div>
            <div className="movie__heading">Production companies</div>
            <div className="movie__production">
                {currentMovieDetail &&
                    currentMovieDetail.production_companies &&
                    currentMovieDetail.production_companies.map((company) => (
                        <>
                            {company.logo_path && (
                                <span className="productionCompanyImage">
                                    <img
                                        className="movie__productionComapany"
                                        src={
                                            "https://image.tmdb.org/t/p/original" +
                                            company.logo_path
                                        }
                                        alt=""
                                    />
                                    <span>{company.name}</span>
                                </span>
                            )}
                        </>
                    ))}
            </div>
        </div>
    );
};

export default Movie;
