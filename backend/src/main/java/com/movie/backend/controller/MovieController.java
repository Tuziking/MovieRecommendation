package com.movie.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.movie.backend.mapper.RatingMapper;
import com.movie.backend.pojo.Likes;
import com.movie.backend.pojo.Rating;
import com.movie.backend.service.GrpcClientService;
import com.movie.backend.service.LikeService;
import com.movie.backend.utils.JwtUtils;
import com.movie.backend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.CompletableFuture;

import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@RestController
@RequestMapping("/movie")
public class MovieController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private RatingMapper ratingMapper;

    @Autowired
    private StatusService statusService;

    @Autowired
    private GrpcClientService grpcClientService;

    @GetMapping("{id}/status")
    public Result getStatus(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userId = JwtUtils.getSubject(token);
        return statusService.getStatus(userId, id);
    }

    @GetMapping("/like")
    public Result getLikeList(@RequestHeader("Authorization") String token) {
        String userId = JwtUtils.getSubject(token);
        return Result.success(likeService.getLikeList(userId));
    }

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

    @GetMapping("")
//    public Result getRecMovies(@RequestHeader("Authorization") String token) throws JsonProcessingException {
//        String userId = JwtUtils.getSubject(token);
//        List<Likes> likesList = likeService.getLikeList(userId);
//
//        if (likesList.size() < 3) {
//            return Result.error("You have not liked enough movies yet.");
//        }
//
//        Set<String> movieIds = new HashSet<>();
//        for (int i = likesList.size() - 3; i < likesList.size(); i++) {
//            log.info("movieID: " + likesList.get(i).getMid());
//            movieIds.add(likesList.get(i).getMid());
//        }
//
//        List<Integer> recommendations = grpcClientService.getRecommendations(List.copyOf(movieIds), userId);
//
//        return Result.success(new HashSet<>(recommendations));
//    }

    public Result getRecMovies(@RequestHeader("Authorization") String token) throws JsonProcessingException {
        String userId = JwtUtils.getSubject(token);
        List<Likes> likesList = likeService.getLikeList(userId);

        if (likesList.size() < 3) {
            return Result.error("You have not liked enough movies yet.");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        Set<Integer> allMovieIds = new HashSet<>();

        HttpClient client = HttpClient.newHttpClient();
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = likesList.size() - 3; i < likesList.size(); i++) {
            log.info("movieID: " + likesList.get(i).getMid());
            String id = likesList.get(i).getMid();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5000/recommend?id=" + id))
                    .header("Content-Type", "application/json")
                    .header("Authorization", token)
                    .GET()
                    .build();

            CompletableFuture<Void> future = client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() == 200) {
                            try {
                                ArrayNode jsonResponse = (ArrayNode) objectMapper.readTree(response.body());
                                for (JsonNode item : jsonResponse) {
                                    int movieId = item.asInt();
                                    allMovieIds.add(movieId);
                                }
                            } catch (JsonProcessingException e) {
                                log.error("Error processing JSON response", e);
                            }
                        } else {
                            log.error("Error in recommendation response: " + response.statusCode());
                        }
                    })
                    .exceptionally(ex -> {
                        log.error("Error sending request to recommendation service", ex);
                        return null;
                    });

            futures.add(future);
        }

        // 等待所有异步任务完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        return Result.success(allMovieIds);
    }

    @PostMapping("/{id}/rate")
    public Result rateMovie(@RequestHeader("Authorization") String token, @PathVariable String id, @RequestBody Map<String,Double> rate) {
        String userId = JwtUtils.getSubject(token);
        log.info("userId: " + userId);
        log.info("movieId: " + id);
        log.info("rating: " + rate.get("rating"));

        Rating rating = new Rating();
        rating.setMovieId(id);
        rating.setUserId(userId);
        rating.setRating(rate.get("rating"));
        rating.setTimestamp(new Date().toInstant());
        ratingMapper.insert(rating);
        return Result.success();
    }
}
