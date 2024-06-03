package com.movie.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.movie.backend.pojo.Likes;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LikeMapper extends BaseMapper<Likes> {
}
