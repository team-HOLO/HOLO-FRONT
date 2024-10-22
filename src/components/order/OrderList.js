import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import OrderItem from './OrderItem';  // OrderItem 컴포넌트 불러오기

const OrderList = ({ orders = [], onCancelOrder, onUpdateStatus }) => { // 기본값 설정
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>주문 번호</TableCell>
                    <TableCell>주문자</TableCell>
                    <TableCell>총금액</TableCell>
                    <TableCell>주문 상태</TableCell>
                    <TableCell>관리</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.length > 0 ? ( // orders가 비어있지 않은 경우
                    orders.map(order => (
                        <OrderItem
                            key={order.orderId}
                            order={order}
                            onCancelOrder={onCancelOrder}
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} align="center">주문이 없습니다.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default OrderList;
