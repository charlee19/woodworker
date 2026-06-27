import { DEV_MODE } from "./lib/dev";

export const getDevUser = () => {
  if (!DEV_MODE) return null;

  return {
    id: "dev-user",
    email: "dev@woodworker.local",
    user_metadata: {
      name: "Dev User",
      role: "CREATOR", // change to CUSTOMER / ADMIN when needed
    },
  };
};