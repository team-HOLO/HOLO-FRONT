import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import CategoryMenu from "components/CategoryMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LoginIcon from "@mui/icons-material/Login";

function Header({ isAdmin, categories, refreshCategories }) {
  const [stateIsAdmin, setStateIsAdmin] = useState(false);
  useEffect(() => {
    refreshCategories();
    // 백엔드에 관리자 권한 확인 요청
    fetch("/api/members/check-admin", {
      method: "GET",
      credentials: "include", // 쿠키 포함
    })
      .then((response) => response.json())
      .then((data) => setStateIsAdmin(data)) // 관리자인 경우 true로 설정
      .catch((error) => console.error("Error checking admin status:", error));
  }, [refreshCategories]);

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            HOLO
          </Link>
        </Typography>
        <Box style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <CategoryMenu
            categories={categories}
            refreshCategories={refreshCategories}
          />
        </Box>
        <Box
          style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
        >
          {stateIsAdmin && ( // stateIsAdmin이 true일 때만 렌더링
            <Typography style={{ flexGrow: 1 }}>
              <Link
                to="/admin"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                관리
              </Link>
            </Typography>
          )}
        </Box>
        <Box
          style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <AddShoppingCartIcon style={{ fontSize: "24px", margin: "0 10px" }} />
          <LoginIcon style={{ fontSize: "24px", margin: "0 10px" }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
