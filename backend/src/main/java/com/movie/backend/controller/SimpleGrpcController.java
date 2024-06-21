package com.movie.backend.controller;


//import com.na.base.BaseResponse;
//import com.na.grpc.client.GrpcClientService;
import com.movie.backend.service.GrpcClientService;
import com.movie.backend.utils.Result;
import com.movie.model.proto.MyRequest;
import com.movie.model.proto.SimpleGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("grpc")
public class SimpleGrpcController {
    @Autowired
    private GrpcClientService service;

    @GetMapping("getOneToOne")
    public Result getOneToOne() {
        return Result.success(service.oneToOne("客户端kele连接"));
    }


//    @GetMapping("testForAddress")
//    public BaseResponse testForAddress() {
//        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 19898)
//            .usePlaintext()
//            .build();
//        MyRequest request = MyRequest.newBuilder().setName("kele的访问").build();
//        SimpleGrpc.SimpleBlockingStub stub = SimpleGrpc.newBlockingStub(channel);
//        return new BaseResponse(stub.oneToOne(request));
//    }

}
