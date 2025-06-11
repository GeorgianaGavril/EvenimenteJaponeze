import { useState } from "react";
import SignUp from "../Components/SignUp";
import SignIn from "../Components/SignIn";
import Navbar from "../Components/Navbar";

export default function Login() {
  const [signUp, setSignUp] = useState(false);

  return (
    <div>
      <Navbar />
      {signUp ? (
        <SignUp toggle={() => setSignUp(false)} />
      ) : (
        <SignIn toggle={() => setSignUp(true)} />
      )}
    </div>
  );
}
