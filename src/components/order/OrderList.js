import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import OrderItem from './OrderItem';

const OrderList = ({ orders = [], onCancelOrder, onUpdateStatus }) => {
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
                {orders.length > 0 ? (
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