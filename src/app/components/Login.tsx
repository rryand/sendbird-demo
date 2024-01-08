import { AuthContext } from "@/context/AuthContext";
import Button from "@/shared/components/Button";
import apiCall from "@/utils/api";
import { useSendbirdStateContext } from "@sendbird/uikit-react";
import { useContext } from "react";

export function Login() {
  const { stores: { userStore: { user } } } = useSendbirdStateContext();
  const isDisabled = Object.keys(user).length === 0;
  const { loginUser } = useContext(AuthContext);

  const login = async() => {
    const response = await apiCall("/users", "POST", {
      id: user.userId,
      nickname: user.nickname,
      profileUrl: user.profileUrl
    });

    const result = await response.json()
    loginUser(result.token);
  }

  return (
    <div className="login">
      <Button onClick={login} disabled={isDisabled}>{isDisabled ? "Loading..." : "Login"}</Button>
    </div>
  );
}
