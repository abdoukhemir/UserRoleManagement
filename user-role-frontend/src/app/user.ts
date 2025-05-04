import { Role } from "./role";

export interface User {
    id: number;
    username: string;
    email: string;
    userRoles: UserRole[];
  }

  export interface UserRole {
    userId: number;
    roleId: number;
    role?: Role; // Include the Role object if the backend query includes it (like in GetUserWithRolesAsync)
    // user?: User; // Typically not needed on the UserRole object itself
  }