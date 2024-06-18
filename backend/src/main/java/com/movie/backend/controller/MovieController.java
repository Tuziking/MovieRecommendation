package com.movie.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.movie.backend.pojo.Likes;
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
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@RestController
@RequestMapping("/movie")
public class MovieController {

    @Autowired
    private LikeService likeService;

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
    public Result getRecMovies(@RequestHeader("Authorization") String token) throws JsonProcessingException {
        String userId = JwtUtils.getSubject(token);
        List<Likes>  likesList = likeService.getLikeList(userId);

        if(likesList.size() <3 ){
            return Result.error("You have not liked any movies yet.");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        List<Integer> allMovieIds = new ArrayList<>();
        //取前三个电影的id
        for(int i = 0;i<3;i++){
            log.info("movieID: " + likesList.get(i).getMid());
            String id = likesList.get(i).getMid();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5000/recommend?id=" + id))
                    .header("Content-Type", "application/json")
                    .header("Authorization", token)
                    .GET()
                    .build();
            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response;
            try {
                response = client.send(request, HttpResponse.BodyHandlers.ofString());

                // Convert response body to JSON format string

//                Object json = objectMapper.readValue(response.body(), Object.class);
//                String jsonString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
//                result.append(jsonString);
////                return Result.success(jsonString);
                if (response.statusCode()==200) {
                    ArrayNode jsonResponse = (ArrayNode) objectMapper.readTree(response.body());
                    int flag = 0;
                    for (JsonNode item : jsonResponse) {
                        if(flag == 4){
                            break;
                        }
                        int movieId = item.get("id").asInt();
                        allMovieIds.add(movieId);
                        flag++;
                    }
                } else {
                    return Result.error("Error in recommendation response");
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
                return Result.error("Error sending request to recommendation service");
            }
        }
        return Result.success(allMovieIds);
    }
}
