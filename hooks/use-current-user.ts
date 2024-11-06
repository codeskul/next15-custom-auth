import { useContext } from "react";

import { UserContext } from "@/context/user-context";

export const useCurrentUser = () => {
  const user = useContext(UserContext);
  return user;
};
