// 1. Setup Transport gRPC
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthServiceClient, IAuthServiceClient } from "@/../../pb/auth/auth.client"; // Path hasil generate proto kamu
import { CourseServiceClient, ICourseServiceClient } from "@/../../pb/course/course.client"; // Path hasil generate proto kamu
import { authInterceptor } from "@/api/grpc/auth-interceptor";
import { CourseChapterServiceClient, ICourseChapterServiceClient } from "@/../../pb/course_chapter/course_chapter.client";
import { ChapterLessonServiceClient, IChapterLessonServiceClient } from "@/../../pb/chapter_lesson/chapter_lesson.client";
import { WatchHistoryServiceClient, IWatchHistoryServiceClient } from "@/../../pb/watch_history/watch_history.client";
import { EnrollmentServiceClient, IEnrollmentServiceClient } from "@/../../pb/enrollment/enrollment.client";
import { CartServiceClient, ICartServiceClient } from "@/../../pb/cart/cart.client";
import { OrderServiceClient, IOrderServiceClient } from "@/../../pb/order/order.client";
import { DashboardUserServiceClient, IDashboardUserServiceClient } from "@/../../pb/dashboard_user/dashboard_user.client";


const GoGrpc_LOGIN_URL = process.env.NEXT_PUBLIC_GRPC_LOGIN_URL
// const GoGrpc_LOGIN_URL = 'http://127.0.0.1:8080';
let webTransport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;
let courseClient: ICourseServiceClient | null = null;
let courseChapterClient: ICourseChapterServiceClient | null = null;
let chapterLessonClient: IChapterLessonServiceClient | null = null;
let watchHistoryClient: IWatchHistoryServiceClient | null = null;
let enrollmentClient: IEnrollmentServiceClient | null = null;
let cartClient: ICartServiceClient | null = null;
let orderClient: IOrderServiceClient | null = null;
let dashboardUserClient: IDashboardUserServiceClient | null = null;

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

export const getChapterLessonClient = () => {
    if (chapterLessonClient === null) {
        chapterLessonClient = new ChapterLessonServiceClient(getWebTransport());
    }
    return chapterLessonClient
}

export const getWatchHistoryClient = () => {
    if (watchHistoryClient === null) {
        watchHistoryClient = new WatchHistoryServiceClient(getWebTransport());
    }
    return watchHistoryClient
}

export const getEnrollmentClient = () => {
    if (enrollmentClient === null) {
        enrollmentClient = new EnrollmentServiceClient(getWebTransport());
    }
    return enrollmentClient
}

export const getCartClient = () => {
    if (cartClient === null) {
        cartClient = new CartServiceClient(getWebTransport());
    }
    return cartClient
}

export const getOrderClient = () => {
    if (orderClient === null) {
        orderClient = new OrderServiceClient(getWebTransport());
    }
    return orderClient
}

export const getDashboardUserClient = () => {
    if (dashboardUserClient === null) {
        dashboardUserClient = new DashboardUserServiceClient(getWebTransport());
    }
    return dashboardUserClient
}