import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
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
import { useNavigate, useParams } from "react-router-dom"; // useParams를 사용해 URL에서 회원 ID를 얻음
import { useEffect, useState } from "react"; // useState와 useEffect 추가

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
  const { memberId } = useParams(); // URL에서 memberId 추출
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState({});
  const [nameError, setNameError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    // 기존 회원 정보를 가져오는 API 호출
    fetch(`/api/members/${memberId}`)
      .then((response) => response.json())
      .then((data) => {
        setMemberData(data);
        setGender(data.gender ? "Male" : "Female"); // Boolean 값을 "Male" 또는 "Female"로 설정
      })
      .catch((error) => console.error("Error fetching member data:", error));
  }, [memberId]);

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

    fetch(`/api/members/${memberId}`, {
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
        navigate("/profile"); // 수정 후 프로필 페이지로 이동
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
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                defaultValue={memberData.name} // 기존 데이터로 채워짐
                error={nameError}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email (read-only)</FormLabel>
              <TextField
                fullWidth
                id="email"
                defaultValue={memberData.email}
                name="email"
                disabled
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="tel">Phone Number</FormLabel>
              <TextField
                required
                fullWidth
                id="tel"
                defaultValue={memberData.tel}
                name="tel"
                error={telError}
              />
            </FormControl>
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
            <FormControl>
              <FormLabel htmlFor="age">Age</FormLabel>
              <TextField
                required
                fullWidth
                id="age"
                defaultValue={memberData.age}
                name="age"
                error={ageError}
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
