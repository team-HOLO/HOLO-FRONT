import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const apiUrl = process.env.REACT_APP_API_URL;

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

const UpdateContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
}));

export default function MemberUpdate() {
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState({});
  const [nameError, setNameError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [gender, setGender] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/api/members/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setMemberData(data);
        setGender(data.gender ? "Male" : "Female");
      })
      .catch((error) => console.error("Error fetching member data:", error));
  }, []);

  const validateInputs = () => {
    const name = document.getElementById("name");
    const tel = document.getElementById("tel");
    const age = document.getElementById("age");

    let isValid = true;

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }

    if (!tel.value || !/^\d{3}-\d{3,4}-\d{4}$/.test(tel.value)) {
      setTelError(true);
      isValid = false;
    } else {
      setTelError(false);
    }

    if (!age.value || isNaN(age.value) || age.value <= 0) {
      setAgeError(true);
      isValid = false;
    } else {
      setAgeError(false);
    }

    if (password !== passwordConfirm) {
      setPasswordError(true);
      setPasswordConfirmError(true);
      setPasswordHelperText("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordConfirmError(false);
      setPasswordHelperText("");
    }

    if (gender === null) {
      alert("성별을 선택해주세요.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const updateData = {
      name: data.get("name"),
      tel: data.get("tel"),
      gender: gender === "Male",
      age: data.get("age"),
      password: password ? password : undefined, // 비밀번호가 있을 때만 업데이트
    };

    fetch(`${apiUrl}/api/members/${memberData.memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("회원 정보 수정 실패");
        }
      })
      .then((data) => {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        navigate("/");
      })
      .catch((error) => console.error("회원 정보 수정 실패:", error));
  };

  // 쿠키 삭제 기능 추가
  const deleteAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/api/members/logout`, {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });
      deleteAllCookies(); // 쿠키 삭제
      navigate("/signin"); // 로그아웃 후 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // 회원 탈퇴 기능 수정: 회원 탈퇴 먼저 처리하고 로그아웃
  const handleDeleteMember = async () => {
    const confirmDelete = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // 1. 회원 탈퇴 요청 먼저 처리
      const response = await fetch(
        `${apiUrl}/api/members/${memberData.memberId}`,
        {
          method: "DELETE",
          credentials: "include", // 쿠키 포함
        }
      );

      if (response.ok) {
        // 2. 회원 탈퇴 성공 시 로그아웃 처리
        await handleLogout(); // 로그아웃 처리 (쿠키 삭제 및 리다이렉트 포함)
      } else {
        throw new Error("회원 탈퇴 실패");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <UpdateContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4">
            회원 정보 수정
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">이메일 (읽기 전용)</FormLabel>
              <TextField
                fullWidth
                id="email"
                value={memberData.email || ""}
                name="email"
                disabled
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="name">이름</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                value={memberData.name || ""}
                error={nameError}
                onChange={(e) =>
                  setMemberData({ ...memberData, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="tel">전화번호</FormLabel>
              <TextField
                required
                fullWidth
                id="tel"
                value={memberData.tel || ""}
                name="tel"
                error={telError}
                onChange={(e) =>
                  setMemberData({ ...memberData, tel: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="gender">성별</FormLabel>
              <RadioGroup
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="남성"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="여성"
                />
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="age">나이</FormLabel>
              <TextField
                required
                fullWidth
                id="age"
                value={memberData.age || ""}
                name="age"
                error={ageError}
                onChange={(e) =>
                  setMemberData({ ...memberData, age: e.target.value })
                }
              />
            </FormControl>

            {/* 비밀번호 필드 추가 */}
            <FormControl>
              <FormLabel htmlFor="password">새 비밀번호</FormLabel>
              <TextField
                fullWidth
                id="password"
                type="password"
                value={password}
                name="password"
                error={passwordError}
                helperText={passwordHelperText}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="passwordConfirm">비밀번호 확인</FormLabel>
              <TextField
                fullWidth
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                name="passwordConfirm"
                error={passwordConfirmError}
                helperText={passwordHelperText}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              정보 수정
            </Button>

            {/* 회원 탈퇴 버튼 추가 */}
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleDeleteMember}
            >
              회원 탈퇴
            </Button>
          </Box>
        </Card>
      </UpdateContainer>
    </>
  );
}
