/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
  /**
   * The admin role grants access to users with the 'admin' role.
   */
  admin: ["admin"],

  /**
   * The client role grants access to users with the 'admin' or 'client' role.
   */
  client: ["admin", "client"],
  /**
   * The staff role grants access to users with the 'admin' or 'staff' role.
   */
  staff: ["admin", "staff"],

  /**
   * The user role grants access to users with the 'admin', 'staff', or 'user' role.
   */
  user: ["admin", "staff", "user"],

  /**
   * The onlyGuest role grants access to unauthenticated users.
   */
  onlyGuest: [],
};

export default authRoles;

/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
export const authRoles1 = {
  /**
   * The onlyGuest role grants access to unauthenticated users.
   */
  onlyGuest: [],
};
