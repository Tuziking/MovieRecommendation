package com.movie.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Status {
    private double rating;
    private boolean isLike;
    private String uuid;
    private String movieId;
}
