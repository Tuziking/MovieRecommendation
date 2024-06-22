package com.movie.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.movie.mapper.LikeMapper;
import com.movie.mapper.RatingMapper;
import com.movie.pojo.Likes;
import com.movie.pojo.Rating;
import com.movie.pojo.Status;
import com.movie.service.StatusService;
import com.movie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class StatusServiceImpl implements StatusService {
    @Autowired
    LikeMapper likeMapper;
    @Autowired
    RatingMapper ratingMapper;
    @Override
    public Result getStatus(String uuid,String movieId) {
        Status status = new Status();
        status.setUuid(uuid);
        status.setMovieId(movieId);
        Likes likes = likeMapper.selectOne(new QueryWrapper<Likes>().eq("uid",uuid).eq("mid",movieId));
        Rating rating = ratingMapper.selectOne(new QueryWrapper<Rating>().eq("userId",uuid).eq("movieId",movieId));
        status.setLike(likes!=null);
        status.setRating(rating==null?-1:rating.getRating());
        return Result.success(status);
    }
}
