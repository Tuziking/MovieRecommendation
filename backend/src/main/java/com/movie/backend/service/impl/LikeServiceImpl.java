package com.movie.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.movie.backend.mapper.LikeMapper;
import com.movie.backend.pojo.Likes;
import com.movie.backend.service.LikeService;
import com.movie.backend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeMapper likeMapper;

    @Override
    public Result addLike(String uID, String mID) {
        Likes likes = new Likes();
        likes.setUid(uID);
        likes.setMid(mID);
        // Check if a Likes record with the same uID and mID already exists
        Likes existingLike = likeMapper.selectOne(new QueryWrapper<>(likes));
        if (existingLike != null) {
            return Result.error("You have already liked this movie.");
        }
        // If no such record exists, insert a new Likes record
        likeMapper.insert(likes);

        return Result.success();
    }

    @Override
    public Result deleteLike(String uID, String mID) {
        Likes likes = new Likes();
        likes.setUid(uID);
        likes.setMid(mID);
        // Check if a Likes record with the same uID and mID exists
        Likes existingLike = likeMapper.selectOne(new QueryWrapper<>(likes));
        if (existingLike == null) {
            return Result.error("You have not liked this movie yet.");
        }
        // If such a record exists, delete it
        likeMapper.delete(new QueryWrapper<>(likes));
        return Result.success();
    }

    @Override
    public List<Likes> getLikeList(String uID) {
        return likeMapper.selectList(new QueryWrapper<Likes>().eq("uid", uID));
    }

}
