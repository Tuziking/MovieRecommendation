package com.movie.backend;

import com.movie.backend.mapper.RatingMapper;
import com.movie.backend.pojo.Rating;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

	@Autowired
	private RatingMapper ratingMapper;

	@Test
	public void testRatingMapper() {
		List<Rating> ratingList = ratingMapper.getRatingList("1");
		for (Rating rating : ratingList) {
			System.out.println(rating);
		}
	}

}
