import useIsTrue from "@/hooks/useIsTrue";
import Link from "next/link";
import React from "react";

const LoginButton = ({ isAuthenticated, userVerified, userNotVerified, verifyUrl, role }) => {

  const isHome2Dark = useIsTrue("/home-2-dark");

  let dashboardUrl = '/login';

  if (userVerified) {
    if (role === 'instructor') {
      dashboardUrl = "/dashboards/instructor/instructor-dashboard";
    } else if (role === 'user') {
      dashboardUrl = "/dashboards/student/student-dashboard";
    }
    else if (role === 'admin') {
      dashboardUrl = "/dashboards/admin/admin-dashboard";
    } else {
      dashboardUrl = "/dashboards";
    }

  } else if (userNotVerified) {
    dashboardUrl = verifyUrl;
  }


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
