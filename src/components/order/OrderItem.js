import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OrderStatusUpdate from './OrderStatusUpdate';

const OrderItem = ({ order, onCancelOrder, onUpdateStatus }) => {
      const formattedOrderId = String(order.orderId).padStart(4, '0');
      const formattedTotalPrice = new Intl.NumberFormat().format(order.totalPrice);

      const statusMapping = {
        ORDER: '주문 완료',
        SHIPPING: '배송중',
        FINISH: '배송 완료',
        CANCEL: '취소됨',
    };
const handleDelete = async () => {
        if (window.confirm('정말로 이 주문을 삭제하시겠습니까?')) {
            await onCancelOrder(order.orderId);
        }
};
    return (
        <TableRow>
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
    );
};

export default OrderItem;