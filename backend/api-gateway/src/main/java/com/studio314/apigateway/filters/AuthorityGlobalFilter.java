package com.studio314.apigateway.filters;

import com.studio314.apigateway.config.AuthProperties;
import com.studio314.apigateway.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthorityGlobalFilter implements GlobalFilter, Ordered {

    private final AuthProperties authProperties;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();
    private static final Logger logger = LoggerFactory.getLogger(AuthorityGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        final long startTime = System.currentTimeMillis();

        ServerHttpRequest request = exchange.getRequest();
        if (isExclude(request.getURI().getPath())) {
            return chain.filter(exchange);
        }

        // 获取token
        final String token;
        List<String> headers = request.getHeaders().get("token");
        if (headers != null && !headers.isEmpty()) {
            token = headers.get(0);
        } else {
            token = null;
        }

        // 解析token
        Mono<String> userIdMono = Mono.fromCallable(() -> JwtUtils.getSubject(token))
                .subscribeOn(Schedulers.boundedElastic())
                .onErrorResume(e -> Mono.empty()); // Return an empty Mono in case of error

        return userIdMono.flatMap(userId -> {
            if (userId == null) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return response.setComplete();
            }

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
        });
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
