import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OrderStatusUpdate from './OrderStatusUpdate';


const OrderItem = ({ order, onCancelOrder, onUpdateStatus }) => {
    const [open, setOpen] = useState(false); // 상세 정보 표시를 위한 상태 추가
    const formattedOrderId = String(order.orderId).padStart(4, '0');
    const formattedTotalPrice = new Intl.NumberFormat().format(order.totalPrice); // 총 가격 포맷팅

    const statusMapping = {
        ORDER: '주문 완료',
        SHIPPING: '배송중',
        FINISH: '배송 완료',
        CANCEL: '취소됨',
    };

    const handleDelete = async () => {
        if (window.confirm('정말로 이 주문을 삭제하시겠습니까?')) {
            await onCancelOrder(order.orderId);
            alert('주문이 삭제되었습니다.');
        }
    };

    return (
        <>
            <TableRow onClick={() => setOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
                <TableCell>{formattedOrderId}</TableCell>
                <TableCell>{order.memberName}</TableCell>
                <TableCell>{formattedTotalPrice} 원</TableCell>
                <TableCell>
                    <OrderStatusUpdate
                        orderId={order.orderId}
                        currentStatus={statusMapping[order.status]}
                        onUpdateStatus={onUpdateStatus}
                    />
                </TableCell>
                <TableCell>
                    <IconButton onClick={handleDelete} aria-label="delete order">
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <p>주문 날짜: {order.orderDate}</p>

                            <p>배송 받는 사람: {order.recipientName}</p>
                            <p>배송지: {order.shippingAddress}</p>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default OrderItem;
