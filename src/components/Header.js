import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import CategoryMenu from "components/CategoryMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LoginIcon from "@mui/icons-material/Login";

function Header({ isAdmin, categories, refreshCategories }) {
  const [stateIsAdmin, setStateIsAdmin] = useState(false);
  const location = useLocation(); // 페이지 위치 감지

  // 페이지가 로드되거나 변경될 때마다 관리자 권한을 확인
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/members/check-admin", {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });
        const data = await response.json();
        setStateIsAdmin(data); // 관리자인 경우 true 설정
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus(); // 권한 확인 함수 호출
    refreshCategories(); // 카테고리 정보 새로고침
  }, [location, refreshCategories]); // location이 변경될 때마다 실행

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
        <Box style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
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
           <Link to="/cart" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <AddShoppingCartIcon style={{ padding: '0 10px' }} />
           </Link>

          <Link
            to="/signin"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <LoginIcon style={{ fontSize: "24px", margin: "0 10px" }} />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
