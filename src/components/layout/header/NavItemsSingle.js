import React from "react";
import Navitem from "./Navitem";
import DropdownDemoes from "./DropdownDemoes";
import DropdownPages from "./DropdownPages";
import DropdownCourses from "./DropdownCourses";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import DropdownDashboard from "./DropdownDashboard";
import DropdownEcommerce from "./DropdownEcommerce";

const NavItemsSingle = () => {
  const navItems = [
    {
      id: 1,
      name: "Home",
      path: "/",
      // dropdown: <DropdownDemoes />,
      isRelative: false,
    },
    {
      id: 2,
      name: "About",
      path: "/#about",
      // dropdown: <DropdownPages />,
      isRelative: false,
    },
    {
      id: 3,
      name: "Categories",
      path: "/#categories",
      // dropdown: <DropdownCourses />,
      isRelative: false,
    },
    {
      id: 4,
      name: "Courses",
      path: "/#courses",
      // dropdown: <DropdownEcommerce />,
      isRelative: false,
    },
    {
      id: 5,
      name: "Testimoni",
      path: "/#testimoni",
      // dropdown: <DropdownDashboard />,
      isRelative: false,
    },
  ];
  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-center">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx: idx }}>
            <DropdownWrapper>{navItem.dropdown}</DropdownWrapper>
          </Navitem>
        ))}
      </ul>
    </div>
  );
};

export default NavItemsSingle;
