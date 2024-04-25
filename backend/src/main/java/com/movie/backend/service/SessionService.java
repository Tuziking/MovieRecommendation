package com.movie.backend.service;

import java.util.Map;


public interface SessionService
{
    Map<String, String> loginSession(String username, String password);
}
