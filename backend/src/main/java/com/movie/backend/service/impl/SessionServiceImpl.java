package com.movie.backend.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.movie.backend.mapper.UserMapper;
import com.movie.backend.pojo.Likes;
import com.movie.backend.pojo.User;
import com.movie.backend.service.SessionService;
import com.movie.backend.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class SessionServiceImpl implements SessionService
{
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserMapper userMapper;

    @Override
    public Map<String, String> loginSession(String username, String password)
    {
        log.info("username: " + username + " password: " + password);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        Authentication authenticate = authenticationManager.authenticate(authenticationToken);

        User user = new User();
        user.setUsername(username);
        User existingUser = userMapper.selectOne(new QueryWrapper<>(user));
        Map<String, String> map = new HashMap<>();
        log.info(existingUser.getId().toString());
        map.put("token", JwtUtils.generateToken(existingUser.getId().toString()));
        return map;
    }
}
