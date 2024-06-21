package com.movie.config;
import com.example.grpc.SimpleServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GrpcClientConfiguration {

    @Bean
    public ManagedChannel managedChannel() {
        return ManagedChannelBuilder.forAddress("localhost", 50051)
            .usePlaintext()
            .build();
    }

    @Bean
    public SimpleServiceGrpc.SimpleServiceBlockingStub simpleServiceBlockingStub(ManagedChannel channel) {
        return SimpleServiceGrpc.newBlockingStub(channel);
    }
}
