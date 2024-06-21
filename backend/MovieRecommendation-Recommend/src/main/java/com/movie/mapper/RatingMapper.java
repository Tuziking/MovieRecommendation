package com.movie.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.movie.pojo.Likes;
import com.movie.pojo.Rating;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RatingMapper extends BaseMapper<Rating> {
    @Select ("select * from Rating where userId = #{userId}")
    List<Rating> getRatingList(String userId);
}
