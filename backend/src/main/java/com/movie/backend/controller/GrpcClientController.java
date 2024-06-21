package com.movie.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.movie.backend.pojo.Likes;
import com.movie.backend.service.GrpcClientService;
import com.movie.backend.service.LikeService;
import com.movie.backend.utils.JwtUtils;
import com.movie.backend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
public class GrpcClientController {

    @Autowired
    private GrpcClientService grpcClientService;

    @Autowired
    private LikeService likeService;

    @GetMapping("/recommend")
    public Result getRecMovies(@RequestHeader("Authorization") String token) throws JsonProcessingException {
        String userId = JwtUtils.getSubject(token);
        List<Likes> likesList = likeService.getLikeList(userId);

        if (likesList.size() < 3) {
            return Result.error("You have not liked enough movies yet.");
        }

        Set<String> movieIds = new HashSet<>();
        for (int i = likesList.size() - 3; i < likesList.size(); i++) {
            log.info("movieID: " + likesList.get(i).getMid());
            movieIds.add(likesList.get(i).getMid());
        }

        List<Integer> recommendations = grpcClientService.getRecommendations(List.copyOf(movieIds), userId);

        return Result.success(new HashSet<>(recommendations));
    }
}
