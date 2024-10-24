import React, {useEffect, useState} from 'react';
import {List, ListItem, ListItemText, Typography, Collapse, IconButton, Box, Button} from '@mui/material';
import { ExpandLess, ExpandMore, LocalShipping, Done, Clear } from '@mui/icons-material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import OrderProductItem from 'components/myPage/OrderProductItem'; // 새로운 컴포넌트 불러오기
import CancelOrderDialog from 'components/myPage/CancelOrderDialog'; // 모달 컴포넌트 추가
import UpdateOrderDialog from 'components/myPage/UpdateOrderDialog';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const MyOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [openOrders, setOpenOrders] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const [selectedOrderInfo, setSelectedOrderInfo] = useState({
        shippingAddress: '',
        recipientName: '',
        shippingRequest: '',
    });

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/orders`, {
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };



    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.put(`${apiUrl}/api/orders/${orderId}/cancel`, {
                withCredentials: true
            });
            alert('주문이 취소되었습니다.');
            fetchOrders();
            // 주문 목록을 새로고침하거나 상태를 업데이트합니다.
        } catch (error) {
            alert('주문 취소에 실패했습니다.');
        }
    };

    const handleUpdateShippingInfo = async (orderId, updateData) => {
        try {
            await axios.put(`${apiUrl}/api/orders/${orderId}/update`, updateData, {
                withCredentials: true
            });
            alert('배송 정보가 업데이트되었습니다.');
            fetchOrders();
        } catch (error) {
            alert('배송 정보 업데이트에 실패했습니다.');
        }
    };

    const handleToggle = (orderId) => {
        setOpenOrders((prevOpenOrders) => ({
            ...prevOpenOrders,
            [orderId]: !prevOpenOrders[orderId],
        }));
    };

    const handleOpenCancelDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setIsCancelDialogOpen(true);
    };

    const handleOpenUpdateDialog = (order) => {
        setSelectedOrderId(order.orderId);
        setSelectedOrderInfo({
            shippingAddress: order.shippingAddress,
            recipientName: order.recipientName,
            shippingRequest: order.shippingRequest,
        });
        setIsUpdateDialogOpen(true);
    };

    const handleCloseCancelDialog = () => {
        setIsCancelDialogOpen(false);
        setSelectedOrderId(null);
    };

    const handleCloseUpdateDialog = () => {
        setIsUpdateDialogOpen(false);
        setSelectedOrderId(null);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ORDER':
                return <ReceiptLongIcon sx={{ color: '#4a90e2' }} />;
            case 'SHIPPING':
                return <LocalShipping sx={{ color: 'orange' }} />;
            case 'FINISH':
                return <Done sx={{ color: 'green' }} />;
            case 'CANCEL':
                return <Clear sx={{ color: '#d0021b' }} />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ORDER':
                return '주문 완료';
            case 'SHIPPING':
                return '배송 중';
            case 'FINISH':
                return '배송 완료';
            case 'CANCEL':
                return '취소 완료';
            default:
                return '알 수 없음';
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'ORDER':
                return '#4a90e2';
            case 'SHIPPING':
                return 'orange';
            case 'FINISH':
                return 'green';
            case 'CANCEL':
                return '#d0021b';
            default:
                return 'black';
        }
    };

    if (!orders || orders.length === 0) {
        return <Typography>주문 내역이 없습니다.</Typography>;
    }

    return (
        <List>
            {orders.map((order) => (
                <React.Fragment key={order.orderId}>
                    <ListItem
                        button
                        onClick={() => handleToggle(order.orderId)}
                        selected={openOrders[order.orderId]}
                        sx={{
                            alignItems: 'flex-start',
                            padding: '16px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: '#f5f5f5' },
                            '&.Mui-selected': {
                                backgroundColor: '#e0e0e0',
                                '&:hover': { backgroundColor: '#d5d5d5' },
                            },
                        }}
                    >
                        {/* 주문 ID 및 배송지 정보 */}
                        <ListItemText
                            primary={<Typography variant="h5" sx={{ fontWeight: 'bold' }}>주문 ID: {order.orderId}</Typography>}
                            secondary={
                                <>
                                    <Typography variant="body2">주문 일자: {order.orderDate}</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>배송지: {order.shippingAddress}</Typography>
                                </>
                            }
                        />
                        {/* 주문 상태와 총 가격 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', minWidth: '250px', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ padding: '10px 10px' }}>
                                총 가격: {order.totalPrice.toLocaleString()}원
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getStatusIcon(order.status)}
                                <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', color: getStatusTextColor(order.status), ml: 1 }}>
                                    {getStatusText(order.status)}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton edge="end">
                            {openOrders[order.orderId] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItem>

                    {/* 주문 상품 목록 */}
                    <Collapse in={openOrders[order.orderId]} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 4 }}>
                            {(order.orderProducts || []).map(product => (
                                <OrderProductItem key={product.id} item={product} />
                            ))}
                            {order.status === 'ORDER' && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button variant="contained" color="primary" onClick={() => handleOpenUpdateDialog(order)}>
                                        배송지 수정
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={() => handleOpenCancelDialog(order.orderId)}>
                                        주문 취소
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </React.Fragment>
            ))}
            <CancelOrderDialog
                open={isCancelDialogOpen}
                orderId={selectedOrderId}
                onClose={handleCloseCancelDialog}
                onCancel={handleCancelOrder}
            />
            <UpdateOrderDialog
                open={isUpdateDialogOpen}
                orderId={selectedOrderId}
                orderInfo={selectedOrderInfo}
                onClose={handleCloseUpdateDialog}
                onUpdate={handleUpdateShippingInfo}
            />
        </List>
    );
};

export default MyOrderPage;
