import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const UpdateOrderDialog = ({ open, orderId, orderInfo, onClose, onUpdate }) => {
    const [shippingAddress, setShippingAddress] = useState(orderInfo.shippingAddress || '');
    const [recipientName, setRecipientName] = useState(orderInfo.recipientName || '');
    const [shippingRequest, setShippingRequest] = useState(orderInfo.shippingRequest || '');

    useEffect(() => {
        if (open) {
            // 다이얼로그가 열릴 때마다 초기 데이터를 로드
            setShippingAddress(orderInfo.shippingAddress || '');
            setRecipientName(orderInfo.recipientName || '');
            setShippingRequest(orderInfo.shippingRequest || '');
        }
    }, [open, orderInfo]);

    const handleUpdate = () => {
        const updatedData = { shippingAddress, recipientName, shippingRequest };
        onUpdate(orderId, updatedData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>배송 정보 수정</DialogTitle>
            <DialogContent>
                <TextField
                    label="배송지"
                    fullWidth
                    margin="dense"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                />
                <TextField
                    label="요청 사항"
                    fullWidth
                    margin="dense"
                    value={shippingRequest}
                    onChange={(e) => setShippingRequest(e.target.value)}
                />
                <TextField
                    label="받는 사람"
                    fullWidth
                    margin="dense"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                    저장
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateOrderDialog;
