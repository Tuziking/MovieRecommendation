package com.movie.service;

import com.movie.pojo.Likes;
import com.movie.utils.Result;

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
