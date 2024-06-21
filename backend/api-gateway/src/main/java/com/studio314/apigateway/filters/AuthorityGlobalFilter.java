package com.studio314.apigateway.filters;

import com.studio314.apigateway.config.AuthProperties;
import com.studio314.tiknotokcommon.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthorityGlobalFilter implements GlobalFilter, Ordered {

    private final AuthProperties authProperties;

    private final AntPathMatcher antPathMatcher = new AntPathMatcher();

    private static final Logger logger = LoggerFactory.getLogger(AuthorityGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();

        ServerHttpRequest request = exchange.getRequest();
        if(isExclude(request.getURI().getPath())){
            return chain.filter(exchange);
        }

        //获取token
        String token = null;
        List<String> headers = request.getHeaders().get("token");
        if(headers != null && !headers.isEmpty()){
            token = headers.get(0);
        }
        //解析token
        String userId = null;
        try {
            userId = JWTUtils.getUserId(token);
        } catch (Exception e) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        System.out.println("userId:"+userId);
        exchange.getRequest().mutate().header("userID", userId);

        logger.info("Incoming request: method={}, uri={}, userID={}",
                exchange.getRequest().getMethod(),
                exchange.getRequest().getURI(),
                userId);

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long duration = System.currentTimeMillis() - startTime;

            logger.info("Outgoing response: status={}, duration={}ms",
                    exchange.getResponse().getStatusCode(),
                    duration);
        }));
    }

    private boolean isExclude(String path) {
        for (String pathPattern : authProperties.getExcludePaths()) {
            if (antPathMatcher.match(pathPattern, path)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
