package com.movie.backend.controller;

import com.movie.backend.service.GrpcClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GrpcClientController {

    @Autowired
    private GrpcClientService grpcClientService;

    @GetMapping("/send")
    public String sendMessage(@RequestParam String name) {
        return grpcClientService.sendMessage(name);
    }
}
