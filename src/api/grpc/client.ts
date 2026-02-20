// 1. Setup Transport gRPC
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthServiceClient, IAuthServiceClient } from "@/../../pb/auth/auth.client"; // Path hasil generate proto kamu
import { CourseServiceClient, ICourseServiceClient } from "@/../../pb/course/course.client"; // Path hasil generate proto kamu
import { authInterceptor } from "@/api/grpc/auth-interceptor";
import { CourseChapterServiceClient, ICourseChapterServiceClient } from "@/../../pb/course_chapter/course_chapter.client";



const GoGrpc_LOGIN_URL = 'http://localhost:8080';
let webTransport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;
let courseClient: ICourseServiceClient | null = null;
let courseChapterClient: ICourseChapterServiceClient | null = null;

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

export const getCourseClient = () => {
    if (courseClient === null) {
        courseClient = new CourseServiceClient(getWebTransport());
    }
    return courseClient
}

export const getCourseChapterClient = () => {
    if (courseChapterClient === null) {
        courseChapterClient = new CourseChapterServiceClient(getWebTransport());
    }
    return courseChapterClient
}