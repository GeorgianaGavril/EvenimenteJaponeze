import { useState } from "react";
import SignUp from "../Components/SignUp";
import SignIn from "../Components/SignIn";

export default function Login() {
  const [signUp, setSignUp] = useState(false);

  return (
    <div>
      {signUp ? (
        <SignUp toggle={() => setSignUp(false)} />
      ) : (
        <SignIn toggle={() => setSignUp(true)} />
      )}
    </div>
  );
}
