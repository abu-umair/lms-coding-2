"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ItemDashboard = ({ item, onClick }) => { // 1. Terima props onClick
  const currentPath = usePathname();
  const { name, path, icon, tag } = item;
  const isActive = currentPath === path;

  return (
    <li className={`py-10px border-b border-borderColor dark:border-borderColor-dark ${tag ? "flex justify-between items-center" : ""
      }`}
    >
      <Link
        href={path === "#" ? "" : path}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault(); // 2. Cegah scroll/navigasi jika ada fungsi onClick
            onClick();
          }
        }}
        className={`${isActive ? "text-primaryColor" : "text-contentColor dark:text-contentColor-dark "
          } hover:text-primaryColor dark:hover:text-primaryColor leading-1.8 flex gap-3 text-nowrap`}
      >
        {icon} {name}
      </Link>
      {tag && (
        <span className="text-size-10 font-medium text-whiteColor px-9px bg-primaryColor leading-14px rounded-2xl">
          {tag}
        </span>
      )}
    </li>
  );
};

export default ItemDashboard;