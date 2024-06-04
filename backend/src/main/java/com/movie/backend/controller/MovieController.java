package com.movie.backend.controller;

import com.movie.backend.service.LikeService;
import com.movie.backend.utils.JwtUtils;
import com.movie.backend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/movie")
public class MovieController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/{movieID}/like")
    public Result likeVideo(@RequestHeader("Authorization") String token, @PathVariable String movieID) {
        String userId = JwtUtils.getSubject(token);
        log.info("userId: " + userId);
        return likeService.addLike(userId, movieID);
    }

    @DeleteMapping("/{movieID}/like")
    public Result cancelLike(@RequestHeader("Authorization") String token, @PathVariable String movieID) {
        String userId = JwtUtils.getSubject(token);
        return likeService.deleteLike(userId, movieID);
    }
}
