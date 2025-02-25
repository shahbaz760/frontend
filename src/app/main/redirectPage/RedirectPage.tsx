import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { setLocalStorageToken } from "src/utils";

const RedirectPage = () => {
  const { token } = useParams();
  const { jwtService } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData: any = jwtDecode(token);
    localStorage.setItem(tokenData?.uuid + "jwt_access_token", token);
    setLocalStorageToken("userTokens", tokenData?.uuid, token);

    localStorage.setItem(
      tokenData?.uuid + "userDetail",
      JSON.stringify(tokenData)
    );
    jwtService.handleSignInSuccess(tokenData?.user, token, true);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, []);

  return <div>Redirect page</div>;
};

export default RedirectPage;
