import { getFromLocalStorage } from "@/actions/get-in-localstorage";
import { setInLocalStorage } from "@/actions/set-in-localstorage";
import { User } from "@/interfaces/user.interface";
import { auth, getDocument } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined | DocumentData>(undefined);
  const pathName = usePathname();
  const router = useRouter();

  const protectedRoutes = ["/dashboard"];
  const isInProtectedRoute = protectedRoutes.includes(pathName);

  const getUserFromDB = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      let res = await getDocument(path);
      setUser(res);
      setInLocalStorage("user", res);
    } catch (error) {}
  };
  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      // ---- Exist auth user ----
      if (authUser) {
        let userInLocal = getFromLocalStorage("user");

        if (userInLocal) setUser(userInLocal);
        else getUserFromDB(authUser.uid);
      }
      // ---- Doesn't exist auth user ----
      else {
        if (isInProtectedRoute) router.push("/");
      }
    });
  }, [isInProtectedRoute, router]);

  return user;
};
