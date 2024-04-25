package com.movie.backend.service;


import java.util.Map;

public interface UserService
{
    Map<String, String> register(String username, String password, String confirmedPassword);
}
