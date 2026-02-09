import ProfileDetails from "@/components/shared/dashboards/ProfileDetails";
import React from "react";
import { authOptions } from "@/libs/authOptions";
import { getAuthClient } from "@/api/grpc/client";
import { getServerSession } from "next-auth";
import { convertTimestampToDate } from "@/utils/date";


const InstructorProfileMain = async () => {
  // Ambil session di server
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  const client = getAuthClient();


  // Kirim token ke gRPC melalui metadata jika diperlukan
  const res = await client.getProfile({}, {
    meta: { // Gunakan 'meta', bukan 'metadata' untuk protobuf-ts
      "authorization": accessToken ? `Bearer ${accessToken}` : ''
    }
  });

  // console.log(res);


  return <ProfileDetails
    user={{
      fullName: res.response.fullName,
      email: res.response.email,
      memberSince: convertTimestampToDate(res.response.memberSince?.seconds),
      role: res.response.roleCode,
    }}
  />;
};

export default InstructorProfileMain;
