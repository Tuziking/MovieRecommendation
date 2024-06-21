package com.movie.backend.service;


//import com.example.grpc.SimpleRequest;
//import com.example.grpc.SimpleResponse;
import com.example.grpc.SimpleProto;
import com.example.grpc.SimpleServiceGrpc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrpcClientService {

    @Autowired
    private SimpleServiceGrpc.SimpleServiceBlockingStub simpleServiceBlockingStub;

    public List<Integer> getRecommendations(List<String> movieIds, String userId) {
        SimpleProto.SimpleRequest request = SimpleProto.SimpleRequest.newBuilder()
                .addAllMovieIds(movieIds)
                .setUserId(userId)
                .build();
        SimpleProto.SimpleResponse response = simpleServiceBlockingStub.simpleMethod(request);
        return response.getRecommendationsList();
    }
}