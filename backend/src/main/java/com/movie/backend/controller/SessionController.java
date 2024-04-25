package com.movie.backend.controller;

import com.movie.backend.service.SessionService;
import com.movie.backend.utils.JwtUtils;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/session")
public class SessionController
{
    @Resource
    SessionService sessionService;

    @PostMapping("")
    public Map<String, String> login(@RequestParam String username, @RequestParam String password)
    {
        return sessionService.loginSession(username, password);
    }

    @PostMapping("/test")
    public String test()
    {
        return "admin";
    }

    @PostMapping("/test2")
    public String test2()
    {
        return "user";
    }
}
