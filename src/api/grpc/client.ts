// 1. Setup Transport gRPC
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthServiceClient, IAuthServiceClient } from "@/../../pb/auth/auth.client"; // Path hasil generate proto kamu
import { authInterceptor } from "@/api/grpc/auth-interceptor";



const GoGrpc_LOGIN_URL = 'http://localhost:8080';
let webTransport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;

const getWebTransport = () => {
    if (webTransport === null) {
        webTransport = new GrpcWebFetchTransport({
            baseUrl: GoGrpc_LOGIN_URL,
            interceptors: [authInterceptor],
        });
    }
    return webTransport
}

export const getAuthClient = () => {
    if (authClient === null) {
        authClient = new AuthServiceClient(getWebTransport());
    }
    return authClient
}