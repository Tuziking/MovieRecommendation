package com.movie.controller;

import com.movie.service.SessionService;
import com.movie.utils.JwtUtils;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/session")
public class SessionController
{
    @Resource
    SessionService sessionService;

    @PostMapping("")
    public Map<String, String> login(@RequestBody HashMap hashMap)
    {
        String username = (String) hashMap.get("username");
        String password = (String) hashMap.get("password");
        return sessionService.loginSession(username, password);
    }

    @PostMapping("/test")
    public String test()
    {
        System.out.println("test");
        return "admin";
    }

    @PostMapping("/test2")
    public String test2()
    {
        return "user";
    }
}
