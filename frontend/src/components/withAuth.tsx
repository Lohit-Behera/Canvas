"use clint";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

export function withAuth(Component: any) {
  return function (props: any) {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    useEffect(() => {
      if (!userInfo) {
        router.push("/login");
      }
    }, [userInfo]);
    return <Component {...props} />;
  };
}
