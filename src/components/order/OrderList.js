import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Collapse, Box, Button } from '@mui/material';
import OrderItem from './OrderItem';  // OrderItem 컴포넌트 불러오기


const OrderList = ({ orders = [], onCancelOrder, onUpdateStatus, onToggleOrder, openOrders }) => { // 추가된 props
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
                        <React.Fragment key={order.orderId}>
                            <OrderItem
                                order={order}
                                onCancelOrder={onCancelOrder}
                                onUpdateStatus={onUpdateStatus}
                                onToggleOrder={onToggleOrder} // 클릭 핸들러 추가
                                open={openOrders[order.orderId]} // 열림 상태 추가
                            />

                            <Collapse in={openOrders[order.orderId]} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 2 }}>
                                    <p>주문 날짜: {order.orderDate}</p>
                                    <p>배송지: {order.shippingAddress}</p>
                                    <p>구매한 제품:</p>
                                    <ul>
                                        {order.orderProducts.map(product => (
                                            <li key={product.id}>{product.name} - {product.price}원</li>
                                        ))}
                                    </ul>
                                </Box>
                            </Collapse>
                        </React.Fragment>
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
