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
  const [gender, setGender] = useState(null);

  useEffect(() => {
    // 로그인된 사용자의 정보를 가져오는 API 호출
    fetch("/api/members/me")
      .then((response) => response.json())
      .then((data) => {
        setMemberData(data);
        setGender(data.gender ? "Male" : "Female"); // Boolean 값을 "Male" 또는 "Female"로 설정
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

    if (gender === null) {
      alert("Please select a gender.");
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
      gender: gender === "Male", // 남자는 true, 여자는 false로 변환
      age: data.get("age"),
    };

    // 로그인된 사용자의 정보를 수정하는 API 호출
    fetch(`/api/members/${memberData.memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to update member information");
        }
      })
      .then((data) => {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        navigate("/"); // 수정 완료 후 리다이렉트
      })
      .catch((error) => console.error("회원 정보 수정 실패:", error));
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <UpdateContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4">
            Update Member Info
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* 이메일 표시 */}
            <FormControl>
              <FormLabel htmlFor="email">Email (read-only)</FormLabel>
              <TextField
                fullWidth
                id="email"
                value={memberData.email || ""} // 이메일 값을 동적으로 상태로 설정
                name="email"
                disabled
              />
            </FormControl>

            {/* 이름 */}
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                value={memberData.name || ""} // 기존 데이터로 채워짐
                error={nameError}
                onChange={(e) =>
                  setMemberData({ ...memberData, name: e.target.value })
                }
              />
            </FormControl>

            {/* 전화번호 */}
            <FormControl>
              <FormLabel htmlFor="tel">Phone Number</FormLabel>
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

            {/* 성별 */}
            <FormControl>
              <FormLabel htmlFor="gender">Gender</FormLabel>
              <RadioGroup
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

            {/* 나이 */}
            <FormControl>
              <FormLabel htmlFor="age">Age</FormLabel>
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

            <Button type="submit" fullWidth variant="contained">
              Update Info
            </Button>
          </Box>
        </Card>
      </UpdateContainer>
    </>
  );
}
