package com.movie.backend.service;

import com.movie.backend.utils.Result;

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

}
