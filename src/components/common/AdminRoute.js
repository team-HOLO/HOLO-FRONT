import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';  // Route는 사용하지 않음
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const AdminRoute = ({ element: Component }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);  // 로딩 상태 추가

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await axios(`${apiUrl}/api/members/check-admin`, {
                    method: "GET",
                    withCredentials: true,
                });
                const data = response.data;
                setIsAdmin(data);  // 관리자인지 여부 설정
            } catch (error) {
                console.error("Error checking admin status:", error);
            } finally {
                setLoading(false);  // 로딩 상태 종료
            }
        };

        checkAdminStatus();
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // 로딩 중일 때 표시
    }

    // 관리자인 경우에만 컴포넌트 렌더링, 아니면 /no-access로 이동
    return isAdmin ? Component : <Navigate to="/no-access" />;
};

export default AdminRoute;
