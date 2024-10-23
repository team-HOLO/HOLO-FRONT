import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import CategoryMenu from "components/CategoryMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
const apiUrl = process.env.REACT_APP_API_URL;
function Header({ categories, refreshCategories }) {
  const [stateIsAdmin, setStateIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 확인 state
  const location = useLocation(); // 페이지 위치 감지

  // 페이지가 로드되거나 변경될 때마다 관리자 권한 및 로그인 여부
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/members/check-admin`, {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });
        const data = await response.json();
        setStateIsAdmin(data); // 관리자인 경우 true 설정
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/members/check-login`, {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });
        const data = await response.json();
        setIsLoggedIn(data); // 로그인 여부 설정
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkAdminStatus(); // 권한 확인 함수 호출
    checkLoginStatus(); // 로그인 여부 확인 함수 호출
    refreshCategories(); // 카테고리 정보 새로고침
  }, [location, refreshCategories]); // location이 변경될 때마다 실행

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/api/members/logout`, {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });
      setIsLoggedIn(false); // 로그아웃 후 로그인 상태 변경
      setStateIsAdmin(false); // 로그아웃 후 관리자 여부 변경
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
      <AppBar
          position="sticky"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 2 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              HOLO
            </Link>
          </Typography>

          {/* 카테고리 메뉴 */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <CategoryMenu categories={categories} refreshCategories={refreshCategories} />
          </Box>

          {/* 관리자 메뉴 : stateIsAdmin이 true일 때만 렌더링*/}
          {stateIsAdmin && (
              <Typography sx={{ mx: 2 }}>
                <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                  관리
                </Link>
              </Typography>
          )}

          {/* 장바구니 및 사용자 메뉴 */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link
                to="/cart"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                }}
            >
              <AddShoppingCartIcon style={{ width: 50, padding: "0 10px" }} />
            </Link>

            {isLoggedIn ? (
                <>
                  <Button component={Link} to="/mypage" color="inherit" sx={{ mx: 1 }}>
                    마이페이지
                  </Button>
                  <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
                    로그아웃
                  </Button>
                </>
            ) : (
                <>
                  <Button component={Link} to="/signin" color="inherit" sx={{ mx: 1 }}>
                    로그인
                  </Button>
                  <Button component={Link} to="/signup" color="inherit" sx={{ mx: 1 }}>
                    회원가입
                  </Button>
                </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
  );
}

export default Header;
