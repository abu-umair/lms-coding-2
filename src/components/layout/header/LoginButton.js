import useIsTrue from "@/hooks/useIsTrue";
import Link from "next/link";
import React from "react";
import { useSession } from 'next-auth/react';

const LoginButton = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const userRole = session?.user?.role;

  const isInstructor = userRole === 'instructor';
  const isUser = userRole === 'user';
  const isHome2Dark = useIsTrue("/home-2-dark");

  const dashboardUrl = isAuthenticated && isInstructor
    ? '/dashboards/instructor-dashboard'
    : isAuthenticated && isUser
      ? '/dashboards/student-dashboard'
      : '/login';


  return (
    <Link
      href={dashboardUrl}
      className="text-size-12 2xl:text-size-15 px-15px py-2 text-blackColor hover:text-whiteColor bg-whiteColor block hover:bg-primaryColor border border-borderColor1 rounded-standard font-semibold mr-[7px] 2xl:mr-15px dark:text-blackColor-dark dark:bg-whiteColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor dark:hover:border-primaryColor"
    >
      {isHome2Dark ? "Login" : <i className="icofont-user-alt-5"></i>}
    </Link>

  );
};

export default LoginButton;
