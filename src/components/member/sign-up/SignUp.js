import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { Link as RouterLink } from "react-router-dom"; // react-router-dom의 Link로 교체
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { GoogleIcon, SitemarkIcon } from "./CustomIcons";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
}));

export default function SignUp() {
  const navigate = useNavigate(); // useNavigate 훅 호출
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [telError, setTelError] = React.useState(false);
  const [telErrorMessage, setTelErrorMessage] = React.useState("");
  const [ageError, setAgeError] = React.useState(false);
  const [ageErrorMessage, setAgeErrorMessage] = React.useState("");
  const [gender, setGender] = React.useState(null);

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");
    const tel = document.getElementById("tel");
    const age = document.getElementById("age");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!tel.value || !/^\d{3}-\d{3,4}-\d{4}$/.test(tel.value)) {
      setTelError(true);
      setTelErrorMessage("Please enter a valid phone number (XXX-XXXX-XXXX).");
      isValid = false;
    } else {
      setTelError(false);
      setTelErrorMessage("");
    }

    if (!age.value || isNaN(age.value) || age.value <= 0) {
      setAgeError(true);
      setAgeErrorMessage("Please enter a valid age.");
      isValid = false;
    } else {
      setAgeError(false);
      setAgeErrorMessage("");
    }

    if (gender === null) {
      alert("Please select a gender.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 동작을 막음
    if (!validateInputs()) return; // 유효성 검사가 통과하지 않으면 요청하지 않음

    const data = new FormData(event.currentTarget);
    const signupData = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      tel: data.get("tel"),
      gender: gender === "Male", // 남자는 true, 여자는 false
      age: data.get("age"),
      isAdmin: false, // 기본 값 false
    };

    fetch("/api/members/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // 회원가입 성공 메시지 처리
        } else if (response.status === 400) {
          return response.text().then((message) => {
            throw new Error(message); // 에러 메시지 던짐
          });
        } else {
          throw new Error("중복된 이메일입니다.");
        }
      })
      .then((message) => {
        console.log("회원가입 성공:", message);
        alert("회원가입 성공");
        navigate("/signin"); // 회원가입 성공 시 /signin 페이지로 리다이렉트
      })
      .catch((error) => {
        console.error("회원가입 실패:", error.message);
        setEmailError(true); // 이메일 에러로 상태 업데이트
        setEmailErrorMessage(error.message); // 에러 메시지 설정
      });
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="tel">Phone Number</FormLabel>
              <TextField
                required
                fullWidth
                id="tel"
                placeholder="010-1234-5678"
                name="tel"
                variant="outlined"
                error={telError}
                helperText={telErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="gender">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="gender-radio-buttons-group"
                name="gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="age">Age</FormLabel>
              <TextField
                required
                fullWidth
                id="age"
                placeholder="25"
                name="age"
                variant="outlined"
                error={ageError}
                helperText={ageErrorMessage}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <span>
                <RouterLink
                  to="/signin"
                  style={{ textDecoration: "none", color: "inherit" }} // 스타일 적용
                >
                  Sign in
                </RouterLink>
              </span>
            </Typography>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}
