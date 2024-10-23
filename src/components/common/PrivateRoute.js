import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const PrivateRoute = ({ element: Component }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);  // 로딩 상태 추가

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/members/check-login`, {
                    method: "GET",
                    credentials: "include", // 쿠키 포함
                });
                const data = await response.json();
                setIsLoggedIn(data);
            } catch (error) {
                console.error("Error checking login status:", error);
            } finally {
                setLoading(false);  // 로딩 완료 상태로 설정
            }
        };

        checkLoginStatus();
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // 로그인 상태를 확인 중일 때 표시
    }

    // 로그인되어 있으면 전달된 컴포넌트 렌더링, 아니면 로그인 페이지로 리다이렉트
    return isLoggedIn ? Component : <Navigate to="/signin" />;
};

export default PrivateRoute;
