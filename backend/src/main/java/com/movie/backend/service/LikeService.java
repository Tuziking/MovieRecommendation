package com.movie.backend.service;

import com.movie.backend.pojo.Likes;
import com.movie.backend.utils.Result;

import java.util.List;

public interface LikeService {
    /**
     * @description: TODO
     * @param: [uID, mID]
     * @return: Result
     */
    Result addLike(String uID, String mID);

    /**
     * @description: TODO
     * @param: [uID, mID]
     * @return: Result
     */
    Result deleteLike(String uID, String mID);

    List<Likes> getLikeList(String uID);

}
