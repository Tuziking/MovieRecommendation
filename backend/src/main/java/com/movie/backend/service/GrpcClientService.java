package com.movie.backend.service;


import com.movie.model.proto.MyRequest;
import com.movie.model.proto.MyResponse;
import com.movie.model.proto.SimpleGrpc;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

/**
 * GrpcClientService类有几处要注意的地方：
 * <p>
 * 用@Service将GrpcClientService注册为spring的普通bean实例；
 * <p>
 * 用@GrpcClient修饰SimpleBlockingStub，这样就可以通过grpc-client-spring-boot-starter库发起gRPC调用，被调用的服务端信息来自名为nacos-grpc服务端配置；
 * <p>
 * SimpleBlockingStub来自前文中根据helloworld.proto生成的java代码；
 * <p>
 * SimpleBlockingStub.oneToOne方法会远程调用nacos-grpc应用的gRPC服务；
 */
@Service
@Slf4j
public class GrpcClientService {

    @GrpcClient("backend")
    private SimpleGrpc.SimpleBlockingStub simpleStub;

    public String oneToOne(final String name) {
        try {
            final MyResponse response = this.simpleStub.oneToOne(MyRequest.newBuilder().setName(name).build());
            return response.getMessage();
        } catch (final StatusRuntimeException e) {
            log.error("FAILED with " + e.getStatus().getCode().name() + ",and e:{}", e.getMessage());
            return "FAILED with " + e.getStatus().getCode().name() + ",and e:" + e.getMessage();
        }
    }
}
