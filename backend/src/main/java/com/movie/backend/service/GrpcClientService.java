package com.movie.backend.service;


import com.example.grpc.SimpleRequest;
import com.example.grpc.SimpleResponse;
import com.example.grpc.SimpleServiceGrpc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GrpcClientService {

    @Autowired
    private SimpleServiceGrpc.SimpleServiceBlockingStub simpleServiceBlockingStub;

    public String sendMessage(String name) {
        SimpleRequest request = SimpleRequest.newBuilder()
            .setName(name)
            .build();
        SimpleResponse response = simpleServiceBlockingStub.simpleMethod(request);
        return response.getMessage();
    }
}
