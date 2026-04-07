import AdminFeedbacks from "@/components/sections/sub-section/dashboards/AdminFeedbacks";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import React from "react";
import { getDashboardUserClient } from "@/api/grpc/client";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";

const StudentDashboardMain = async () => {
  // 1. Ambil session
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  // 2. Fetch Data dari gRPC
  const client = getDashboardUserClient();
  const res = await client.getDashboardUser({
    userId: userId,
    fieldMask: {
      paths: ["progress"]
    }
  }, {
    meta: { "authorization": accessToken ? `Bearer ${accessToken}` : '' }
  });

  const courses = res.response.courses || [];

  // 3. Hitung Counter secara dinamis
  const stats = {
    enrolled: courses.length,
    active: courses.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100).length,
    completed: courses.filter(c => (c.progress || 0) === 100).length
  };

  return (
    <>
      <CounterStudent stats={stats} />
      <AdminFeedbacks />
    </>
  );
};

export default StudentDashboardMain;
