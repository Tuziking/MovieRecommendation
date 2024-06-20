package com.movie.backend.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("Rating")
public class Rating {
    @TableField("userId")
    private String userId;
    @TableField("movieId")
    private String movieId;
    private double rating;
    private Instant timestamp;
}
