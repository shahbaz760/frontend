import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import _ from "@lodash";
import { PartialDeep } from "type-fest";
import { useAppDispatch } from "app/store/store";
import { logIn, sociallogIn } from "app/store/Auth";
import {
  getClientId,
  getLocalStorage,
  getParamFromPathname,
  getToken,
  getUserDetail,
  setLocalStorageToken,
} from "src/utils";
import { setInitialState } from "app/theme-layouts/shared-components/navigation/store/navigationSlice";
import { updateResetColumn, updateSelectedColumn } from "app/store/Client";
import { useLocation } from "react-router";
const defaultAuthConfig = {
  tokenStorageKey: "jwt_access_token",
  signInUrl: "api/auth/sign-in",
  signUpUrl: "api/auth/sign-up",
  tokenRefreshUrl: "api/auth/refresh",
  getUserUrl: "api/auth/user",
  updateUserUrl: "api/auth/user",
  updateTokenFromHeader: false,
};

export type JwtAuthProps<T> = {
  config: {
    tokenStorageKey: string;
    signInUrl: string;
    signUpUrl: string;
    tokenRefreshUrl: string;
    getUserUrl: string;
    updateUserUrl: string;
    /**
     * If the response auth header contains a new access token, update the token
     * in the Authorization header of the successful responses
     */
    updateTokenFromHeader: boolean;
  };
  onSignedIn?: (U: T) => void;
  onSignedUp?: (U: T) => void;
  onSignedOut?: () => void;
  onUpdateUser?: (U: T) => void;
  onError?: (error: AxiosError) => void;
};

type SignInPayload = {
  email?: string;
  password?: string;
};

type SocialSignInPayload = {
  email: string;
  id: string;
  type: number;
  firstname: string;
  lastname: string;
};

export type JwtAuth<User, SignUpPayload> = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (U: SignInPayload) => void;
  socialSignIn: (U: SocialSignInPayload) => void;
  autoSignIng: () => void;
  agentSignIn: () => void;
  ResetsignIn: (U: any) => void;
  signOut: () => void;
  signUp: (U: SignUpPayload) => Promise<AxiosResponse<User, AxiosError>>;
  updateUser: (U: PartialDeep<User>) => void;
  refreshToken: () => void;
  setIsLoading: (isLoading: boolean) => void;
  handleLoginAsClientSignIn: (data: any) => void;
  handleSignInSuccess: (
    userData: User,
    accessToken: string,
    isAdmin?: boolean
  ) => void;
  setSession: (token: string, userDetail?: any, isAdmin?: boolean) => void;
  addClientId: (newId: string) => void;
  clientIds: string[];
  setIsAuthenticated: any;
  setUser: any;
  onSignedIn: any;
};

/**
 * useJwtAuth hook
 * Description: This hook handles the authentication flow using JWT
 * It uses axios to make the HTTP requests
 * It uses jwt-decode to decode the access token
 * It uses localStorage to store the access token
 * It uses Axios interceptors to update the access token from the response headers
 * It uses Axios interceptors to sign out the user if the refresh token is invalid or expired
 */

const useJwtAuth = <User, SignUpPayload>(
  props: JwtAuthProps<User>
): JwtAuth<User, SignUpPayload> => {
  const { config, onSignedIn, onSignedOut, onSignedUp, onError, onUpdateUser } =
    props;
  const dispatch = useAppDispatch();
  // Merge default config with the one from the props
  const authConfig = _.defaults(config, defaultAuthConfig);

  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Get the location object
  const pathname = location.pathname; // Access the pathname
  const [clientIds, setClientIds] = useState([""]);
  let param = pathname.split("/");
  param = param.filter((word) => word !== "");
  const isAdmin = !isNaN(+param[0]);
  /**
   * Set session
   */
  const setSession = useCallback(
    (accessToken: string, userDetail?: User, isAdmin?: boolean) => {
      const userInfo: any = userDetail;
      const userId = userInfo?.id;
      const userUuid = userInfo?.uuid;
      const clientId = getClientId();
      if (userInfo?.role_id == 2 && clientId) {
        localStorage.setItem(
          userUuid + authConfig.tokenStorageKey,
          accessToken
        );
        setLocalStorageToken("userTokens", userUuid, accessToken);
        localStorage.setItem(
          userUuid + "userDetail",
          JSON.stringify(userDetail)
        );
        // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else if (accessToken && userDetail) {

        localStorage.setItem(authConfig.tokenStorageKey, accessToken);
        localStorage.setItem("userDetail", JSON.stringify(userDetail));
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      }
    },
    []
  );

  const resetSession = useCallback(() => {
    delete axios.defaults.headers.common.Authorization;
    const clientId = getClientId();

    const dataKey = clientId ? clientId + "userDetail" : "userDetail";
    // if (clientId) {
    //   localStorage.removeItem("authService");
    // }
    const tokenKey = clientId
      ? clientId + authConfig.tokenStorageKey
      : authConfig.tokenStorageKey;
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(dataKey);
    // localStorage.clear();
  }, []);

  /**
   * Get access token from local storage
   */
  const getAccessToken = useCallback(() => {

    const clientId = getClientId();
    const tokenKey = clientId
      ? clientId + authConfig.tokenStorageKey
      : authConfig.tokenStorageKey;
    const token = localStorage.getItem(tokenKey);
    return token;
  }, []);

  /**
   * Handle sign-in success
   */
  const handleSignInSuccess = useCallback(
    (userData: User, accessToken: string, isAdmin?: boolean) => {
      setSession(accessToken, userData, isAdmin);
      setIsAuthenticated(true);
      setUser(userData);
      onSignedIn(userData);
    },
    []
  );

  /**
   * Handle sign-up success
   */
  const handleSignUpSuccess = useCallback(
    (userData: User, accessToken: string) => {
      setSession(accessToken, userData);
      setIsAuthenticated(true);
      setUser(userData);
      onSignedUp(userData);
    },
    []
  );

  /**
   * Handle sign-in failure
   */
  const handleSignInFailure = useCallback((error: AxiosError) => {
    resetSession();
    setIsAuthenticated(false);
    setUser(null);
    handleError(error);
  }, []);

  /**
   * Handle sign-up failure
   */
  const handleSignUpFailure = useCallback((error: AxiosError) => {
    resetSession();
    setIsAuthenticated(false);
    setUser(null);
    handleError(error);
  }, []);

  /**
   * Handle error
   */
  const handleError = useCallback((error: AxiosError) => {
    onError(error);
  }, []);

  /**
   * Check if the access token is valid
   */
  const isTokenValid = useCallback((accessToken: string) => {
    if (accessToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      } catch (error) {
        return false;
      }
    }
    return false;
  }, []);

  /**
   * Check if the access token exist and is valid on mount
   * If it is, set the user and isAuthenticated states
   * If not, clear the session
   */
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const accessToken = getAccessToken();
      const clientId = getClientId();
      const dataKey = clientId ? clientId + "userDetail" : "userDetail";
      const userData = JSON.parse(localStorage.getItem(dataKey));
      if (!!accessToken) {
        handleSignInSuccess(userData, accessToken, isAdmin);
      } else {
        resetSession();
        return false;
      }
    };

    if (!isAuthenticated) {
      attemptAutoLogin().then(() => {
        setIsLoading(false);
      });
    }
  }, [
    isTokenValid,
    setSession,
    handleSignInSuccess,
    handleSignInFailure,
    handleError,
    getAccessToken,
    isAuthenticated,
  ]);

  /**
   * Sign in
   */
  const signIn = async (credentials: SignInPayload) => {
    let response = await dispatch(
      logIn({ email: credentials?.email, password: credentials?.password })
    );

    if (response?.payload?.status) {
      const userData = response?.payload.data?.user;
      dispatch(setInitialState(userData));
      const accessToken = response?.payload.data?.access_token;
      const signin = response?.payload.data?.user?.is_signed;
      const link = response?.payload.data?.user?.subscription_and_docusign;
      const currentUrl = window.location.href;
      // localStorage.setItem(
      //   "userData",
      //   JSON.stringify(userData.subscription_and_docusign)
      // );

      if (response?.payload.data?.user?.role_id == 1) {
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.user?.role_id == 4) {
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.user?.role_id == 5) {
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.user?.role_id == 3) {
        setIsLoading(true);
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else if (response?.payload.data?.user?.is_complete_profile == 1) {
          const docusignLink = response?.payload.data?.user?.docusign_link;
          if (docusignLink) {
            window.location.href = docusignLink;
          } else {
          }
        } else if (response?.payload.data?.user?.is_complete_profile == 2) {
          if (!currentUrl.includes("/kyc-doc/")) {
            window.location.href = `/kyc-doc/${accessToken}`;
          }
        } else if (response?.payload.data?.user?.is_complete_profile == 3) {
          if (!currentUrl.includes("/photo-id/")) {
            window.location.href = `/photo-id/${accessToken}`;
          }
        } else if (response?.payload.data?.user?.is_complete_profile == 4) {
          if (!currentUrl.includes("/upload-doc/")) {
            window.location.href = `/upload-doc/${accessToken}`;
          }
        } else if (response?.payload.data?.user?.is_complete_profile == 6) {
          if (!currentUrl.includes("/reject-kyc/")) {
            window.location.href = `/reject-kyc/${accessToken}`;
          }
        } else {
          setIsLoading(false);
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.user?.role_id == 2) {
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      }

      // handleSignInSuccess(userData, accessToken);
      // window.location.reload();
      // localStorage.setItem(
      //   "userData",
      //   JSON.stringify(userData.subscription_and_docusign)
      // );
    }
    return response;
  };

  const socialSignIn = async (credentials: SocialSignInPayload) => {
    let response = await dispatch(
      sociallogIn({
        social_id: credentials?.id,
        social_type: credentials?.type,
        first_name: credentials?.firstname,
        last_name: credentials?.lastname,
        email: credentials?.email,
      })
    );

    if (response?.payload?.status) {
      const userData = response?.payload.data?.user;
      dispatch(setInitialState(userData));
      const accessToken = response?.payload.data?.access_token;
      const signin = response?.payload.data?.user?.is_signed;
      const link = response?.payload.data?.user?.subscription_and_docusign;


      localStorage.setItem(
        "userData",
        JSON.stringify(userData?.subscription_and_docusign || [])
      );
      if (response?.payload.data?.user?.role_id == 1) {
        handleSignInSuccess(userData, accessToken);
        window.location.reload();
      } else if (response?.payload.data?.user?.role_id == 2) {
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      }
      // handleSignInSuccess(userData, accessToken);
      // window.location.reload();
    }
    return response;
  };

  const autoSignIng = () => {
    let response = getLocalStorage("response");
    const token = localStorage.getItem("jwt_access_token");

    if (
      response?.user?.is_signed &&
      response.user?.subscription_and_docusign.length == 0
    ) {
      const userData = response?.user;
      dispatch(setInitialState(userData));
      const accessToken = token;
      if (response.user.projects?.length > 0) {
        handleSignInSuccess(userData, accessToken);
        window.location.reload();
      }
    }
  };

  const agentSignIn = () => {
    let response = getLocalStorage("response");
    const accessToken = response?.access_token;
    const userData = response?.user;
    dispatch(setInitialState(userData));
    setIsLoading(true);
    const currentUrl = window.location.href;
    if (response?.user?.is_complete_profile == 1) {
      const docusignLink = response?.user?.docusign_link;
      if (docusignLink && response?.user?.is_complete_profile == 1) {
        setIsLoading(false);
        window.location.href = docusignLink;
      } else {
      }
    } else if (response?.user?.is_complete_profile == 2) {
      setIsLoading(false);
      if (!currentUrl.includes("/kyc-doc/")) {
        window.location.href = `/kyc-doc/${accessToken}`;
      } else {
        console.log("Already on /kyc-doc/ page, not redirecting.");
      }
    } else if (response?.user?.is_complete_profile == 3) {
      setIsLoading(false);
      if (!currentUrl.includes("/photo-id/")) {
        window.location.href = `/photo-id/${accessToken}`;
      } else {
        console.log("Already on /photo-id/ page, not redirecting.");
      }
    } else if (response?.user?.is_complete_profile == 4) {
      setIsLoading(false);
      if (!currentUrl.includes("/upload-doc/")) {
        window.location.href = `/upload-doc/${accessToken}`;
      } else {
        console.log("Already on /photo-id/ page, not redirecting.");
      }
    } else if (response?.user?.is_complete_profile == 6) {
      setIsLoading(false);
      if (!currentUrl.includes("/reject-kyc/")) {
        window.location.href = `/reject-kyc/${accessToken}`;
      } else {
        console.log("Already on /photo-id/ page, not redirecting.");
      }
    } else {
      setIsLoading(false);
      handleSignInSuccess(userData, accessToken);
      window.location.reload();
    }
  };

  const ResetsignIn = async (response: any) => {
    // let response = await dispatch(
    //   logIn({ email: credentials?.email, password: credentials?.password })
    // );
    const currentUrl = window.location.href;
    if (response?.payload?.data?.status) {
      const userData = response?.payload.data?.data?.user;
      dispatch(setInitialState(userData));
      const accessToken = response?.payload.data?.data?.access_token;
      const signin = response?.payload.data?.data?.user?.is_signed;
      const link =
        response?.payload.data?.data?.user?.subscription_and_docusign;

      localStorage.setItem(
        "userData",
        JSON.stringify(userData.subscription_and_docusign)
      );

      if (response?.payload.data?.data?.user?.role_id == 1) {
        handleSignInSuccess(userData, accessToken);
        window.location.reload();
      } else if (response?.payload.data?.data?.user?.role_id == 4) {
        if (
          response?.payload.data?.data?.user?.two_factor_authentication == 1
        ) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.data?.user?.role_id == 5) {
        if (
          response?.payload.data?.data?.user?.two_factor_authentication == 1
        ) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.data?.user?.role_id == 3) {
        setIsLoading(true);
        if (
          response?.payload.data?.data?.user?.two_factor_authentication == 1
        ) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else if (
          response?.payload.data?.data?.user?.is_complete_profile == 1
        ) {
          const docusignLink =
            response?.payload.data?.data?.user?.docusign_link;
          if (docusignLink) {
            window.location.href = docusignLink;
          } else {
            console.log("Docusign link is not valid.");
          }
        } else if (
          response?.payload.data?.data?.user?.is_complete_profile == 2
        ) {
          if (!currentUrl.includes("/kyc-doc/")) {
            window.location.href = `/kyc-doc/${accessToken}`;
          }
        } else if (
          response?.payload.data?.data?.user?.is_complete_profile == 3
        ) {
          if (!currentUrl.includes("/photo-id/")) {
            window.location.href = `/photo-id/${accessToken}`;
          }
        } else if (
          response?.payload.data?.data?.user?.is_complete_profile == 4
        ) {
          if (!currentUrl.includes("/upload-doc/")) {
            window.location.href = `/upload-doc/${accessToken}`;
          }
        } else if (
          response?.payload.data?.data?.user?.is_complete_profile == 6
        ) {
          if (!currentUrl.includes("/reject-kyc/")) {
            window.location.href = `/reject-kyc/${accessToken}`;
          }
        } else {
          setIsLoading(false);
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      } else if (response?.payload.data?.data?.user?.role_id == 2) {
        if (response?.payload.data?.user?.two_factor_authentication == 1) {
          localStorage.setItem(
            "email",
            JSON.stringify(response?.payload.data?.user?.email)
          );
          window.location.href = `/2fa-verification/${accessToken}`;
        } else {
          handleSignInSuccess(userData, accessToken);
          window.location.reload();
        }
      }
      // handleSignInSuccess(userData, accessToken);
      // window.location.reload();
    }
    return response;
  };

  /**
   * Sign up
   */
  const signUp = useCallback((data: SignUpPayload) => {
    const response = axios.post(authConfig.signUpUrl, data);

    response.then(
      (res: AxiosResponse<{ user: User; access_token: string }>) => {
        const userData = res?.data?.user;
        const accessToken = res?.data?.access_token;

        handleSignUpSuccess(userData, accessToken);

        return userData;
      },
      (error) => {
        const axiosError = error as AxiosError;

        handleSignUpFailure(axiosError);
        return axiosError;
      }
    );

    return response;
  }, []);

  /**
   * Sign out
   */
  const signOut = useCallback(() => {
    dispatch(
      updateResetColumn([
        "ID",
        "Name",
        "Company Name",
        "Joining Date",
        "Subscription Status",
        "Account Status",
        "",
      ])
    );
    resetSession();
    // localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    onSignedOut();
  }, []);

  /**
   * Update user
   */
  const updateUser = useCallback(async (userData: PartialDeep<User>) => {
    try {
      const response: AxiosResponse<User, PartialDeep<User>> = await axios.put(
        authConfig.updateUserUrl,
        userData
      );
      const updatedUserData = response?.data;

      onUpdateUser(updatedUserData);

      return null;
    } catch (error) {
      const axiosError = error as AxiosError;

      handleError(axiosError);
      return axiosError;
    }
  }, []);

  /**
   * Refresh access token
   */
  const refreshToken = async () => {
    setIsLoading(true);


    try {
      const response: AxiosResponse<string> = await axios.post(
        authConfig.tokenRefreshUrl
      );

      const accessToken = response?.headers?.["New-Access-Token"] as string;

      if (accessToken) {
        setSession(accessToken);

        return accessToken;
      }
      return null;
    } catch (error) {
      const axiosError = error as AxiosError;

      handleError(axiosError);
      return axiosError;
    }
  };

  /**
   * login as client function to handle client token and data
   */

  const handleLoginAsClientSignIn = (clientData: any) => {
    if (clientData?.status) {
      const userData = clientData.data?.user;
      const redirectPath = `${clientData.data?.access_token}/redirect-page?ci=${userData?.uuid}`;
      const isAdmin = clientData.data?.is_admin;
      dispatch(setInitialState(userData));
      const accessToken = clientData.data?.access_token;
      const signin = clientData.data?.user?.is_signed;
      const link = clientData.data?.user?.subscription_and_docusign;
      localStorage.setItem(
        "userData",
        JSON.stringify(userData.subscription_and_docusign)
      );
      localStorage.setItem(
        clientData.data?.user?.uuid + "jwt_access_token",
        clientData.data?.access_token
      );
      setLocalStorageToken(
        "userTokens",
        clientData.data?.user?.uuid,
        clientData.data?.access_token
      );

      localStorage.setItem(
        userData?.uuid + "userDetail",
        JSON.stringify(userData)
      );
      window.open(redirectPath);
    }
  };
  /**
   * if a successful response contains a new Authorization header,
   * updates the access token from it.
   *
   */
  useEffect(() => {
    if (authConfig.updateTokenFromHeader && isAuthenticated) {
      axios.interceptors.response.use(
        (response) => {
          const newAccessToken = response?.headers?.[
            "New-Access-Token"
          ] as string;

          if (newAccessToken) {
            setSession(newAccessToken);
          }
          return response;
        },
        (error) => {
          const axiosError = error as AxiosError;

          if (axiosError?.response?.status === 401) {
            signOut();
            // eslint-disable-next-line no-console
            console.warn("Unauthorized request. User was signed out.");
          }
          return Promise.reject(axiosError);
        }
      );
    }
  }, [isAuthenticated]);

  const addClientId = (newId: string) => {
    setClientIds([...clientIds, newId]);
  };
  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    autoSignIng,
    agentSignIn,
    socialSignIn,
    ResetsignIn,
    signUp,
    signOut,
    updateUser,
    refreshToken,
    setIsLoading,
    handleLoginAsClientSignIn,
    handleSignInSuccess,
    setSession,
    addClientId,
    clientIds,
    setIsAuthenticated,
    onSignedIn,
    setUser,
  };
};

export default useJwtAuth;
