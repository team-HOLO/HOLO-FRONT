import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const CancelOrderDialog = ({ open, orderId, onClose, onCancel }) => {
    const handleCancel = () => {
        onCancel(orderId);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>주문 번호 {orderId}</DialogTitle>
            <DialogContent>
                <Typography>정말로 주문을 취소하시겠습니까?</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
                <Button variant="contained" color="error" onClick={handleCancel}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelOrderDialog;
