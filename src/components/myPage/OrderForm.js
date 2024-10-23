import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const OrderForm = ({ open, onClose, existingOrder, onUpdate }) => {
    const [recipientName, setRecipientName] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingRequest, setShippingRequest] = useState('');

    useEffect(() => {
        if (existingOrder) {
            setRecipientName(existingOrder.recipientName);
            setShippingAddress(existingOrder.shippingAddress);
            setShippingRequest(existingOrder.shippingRequest);
        }
    }, [existingOrder]);

    const handleSubmit = async () => {
        try {
            await axios.put(`${apiUrl}/api/orders/${existingOrder.orderId}/shipping/update`, {
                recipientName,
                shippingAddress,
                shippingRequest,
            }, {
                withCredentials: true,
            });

            alert('주문 정보가 수정되었습니다.');
            onUpdate(); // 주문 목록 새로고침
            onClose();
        } catch (error) {
            console.error(error);
            alert('주문 정보 수정에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>주문 정보 수정</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="받는 사람"
                    type="text"
                    fullWidth
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="배송지 주소"
                    type="text"
                    fullWidth
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="배송 요청 사항"
                    type="text"
                    fullWidth
                    value={shippingRequest}
                    onChange={(e) => setShippingRequest(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    취소
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    수정하기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderForm;
