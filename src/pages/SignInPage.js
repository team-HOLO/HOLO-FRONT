import React from "react";
import SignIn from "../components/member/signin/SignIn";
import { CssBaseline, GlobalStyles } from "@mui/material"; // GlobalStyles 가져오기

const SignInPage = () => {
  return (
    <>
      <CssBaseline enableColorScheme />
      {/* GlobalStyles로 전역 스타일 추가 */}
      <GlobalStyles styles={{ "*": { boxSizing: "border-box" } }} />
      <SignIn />
    </>
  );
};

export default SignInPage;
