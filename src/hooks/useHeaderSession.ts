"use client";

import { useCallback, useEffect, useState } from "react";
import { SessionManager } from "@/lib/auth";

interface HeaderSessionState {
  isLoggedIn: boolean;
  userEmail: string;
  userDisplayName: string;
  userPhotoUrl: string;
}

const getSessionState = (): HeaderSessionState => {
  const isAuthenticated = SessionManager.isAuthenticated();

  if (!isAuthenticated) {
    return {
      isLoggedIn: false,
      userEmail: "",
      userDisplayName: "",
      userPhotoUrl: "",
    };
  }

  const session = SessionManager.getSession();
  const email = session?.user?.email || "";
  const firstname = session?.user?.firstname?.trim();
  const derivedName = session?.user?.name?.trim() || (email ? email.split("@")[0] : "");
  const photoUrl = session?.user?.photoUrl?.trim() || "";

  return {
    isLoggedIn: true,
    userEmail: email,
    userDisplayName: firstname || derivedName,
    userPhotoUrl: photoUrl,
  };
};

export const useHeaderSession = () => {
  const [sessionState, setSessionState] = useState<HeaderSessionState>(() =>
    getSessionState()
  );

  const refreshSession = useCallback(() => {
    setSessionState(getSessionState());
  }, []);

  useEffect(() => {
    refreshSession();

    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === "isLoggedIn" ||
        event.key === "userEmail" ||
        event.key === "userProfile"
      ) {
        refreshSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshSession]);

  const clearSessionState = useCallback(() => {
    setSessionState({
      isLoggedIn: false,
      userEmail: "",
      userDisplayName: "",
      userPhotoUrl: "",
    });
  }, []);

  return {
    ...sessionState,
    refreshSession,
    clearSessionState,
  };
};
