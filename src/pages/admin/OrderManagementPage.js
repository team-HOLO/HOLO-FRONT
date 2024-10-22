import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, TablePagination } from '@mui/material';
import OrderList from 'components/order/OrderList';  // OrderList 컴포넌트 불러오기

function OrderManagementPage() {
    const [orders, setOrders] = useState([]);  // 주문 목록을 저장할 상태
    const [page, setPage] = useState(0);  // 현재 페이지 상태
    const rowsPerPage = 10;  // 페이지당 행 수를 10으로 고정
    const [openOrders, setOpenOrders] = useState({});

    // 주문 목록 불러오기
    useEffect(() => {
        fetchOrders();
    }, []);

const apiUrl = process.env.REACT_APP_API_URL;

    const fetchOrders = async () => {
        try {
            const response = await axios.get('${apiUrl}/api/admin/orders');  // API 호출
            setOrders(response.data);  // 불러온 주문 목록을 상태에 저장
        } catch (error) {
            console.error('주문 목록을 불러오는 데 실패했습니다:', error);
        }
    };

    // 주문 취소
    const cancelOrder = async (orderId) => {
        try {
            await axios.delete(`${apiUrl}/api/orders/${orderId}`);  // 취소 API 호출
            fetchOrders();  // 취소 후 주문 목록 갱신
        } catch (error) {
            console.error('주문 취소에 실패했습니다:', error);
        }
    };

    // 주문 상태 변경
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${apiUrl}/api/admin/orders/${orderId}/status`, { newStatus });  // 상태 변경 API 호출
            fetchOrders();  // 상태 변경 후 주문 목록 갱신
        } catch (error) {
            console.error('주문 상태 변경에 실패했습니다:', error);
        }
    };

     // 주문 상세 정보 핸들러
     const handleToggleOrder = (orderId) => {
         setOpenOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
     };

    // 페이지 변경 핸들러
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // 현재 페이지에 맞는 주문 목록 가져오기
    const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container>
            <h1>주문 관리</h1>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <OrderList
                    orders={paginatedOrders}
                    onCancelOrder={cancelOrder}
                    onUpdateStatus={updateOrderStatus}
                    onToggleOrder={handleToggleOrder}
                    openOrders={openOrders}
                />
            </Box>
            <TablePagination
                component="div"
                count={orders.length}
                page={page}
                onPageChange={handleChangePage}  // 여기 수정
                rowsPerPage={10} // 고정된 페이지 크기
                rowsPerPageOptions={[]} // 빈 배열로 설정하여 행 수 변경 옵션 제거
            />
        </Container>
    );
}

export default OrderManagementPage;
