// The logged-in trader's name and email (from the login screen).
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as profileService from "../services/profileService.js";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => profileService.getProfile());

  const logIn = useCallback((details) => {
    profileService.saveProfile(details);
    setProfile(profileService.getProfile());
  }, []);

  const logOut = useCallback(() => {
    profileService.clearProfile();
    setProfile(null);
  }, []);

  const value = useMemo(() => ({ profile, logIn, logOut }), [profile, logIn, logOut]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside <ProfileProvider>");
  return context;
}
