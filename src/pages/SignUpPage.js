import React from "react";
import SignUp from "../components/member/sign-up/SignUp";
import { CssBaseline, GlobalStyles } from "@mui/material"; // GlobalStyles 가져오기

const SignUpPage = () => {
  return (
    <>
      <CssBaseline enableColorScheme />
      {/* GlobalStyles로 전역 스타일 추가 */}
      <GlobalStyles styles={{ "*": { boxSizing: "border-box" } }} />
      <SignUp />
    </>
  );
};

export default SignUpPage;
