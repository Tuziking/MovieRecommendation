package com.movie.service;

import com.movie.utils.Result;

public interface StatusService {
    Result getStatus(String uuid,String movieId);
}
