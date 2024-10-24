import React, { useState } from 'react';
import { Button, Modal, Box, MenuItem, Select, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4,
    borderRadius: 2,
    bgcolor: 'background.paper',
};

function OrderStatusUpdate({ orderId, currentStatus, onUpdateStatus }) {
    const [newStatus, setNewStatus] = useState('ORDER');
    const [open, setOpen] = useState(false);

    // 상태 변경 제출
    const handleSubmit = () => {
        onUpdateStatus(orderId, newStatus);
        handleClose();
    };

    // 모달 닫기
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained" onClick={() => setOpen(true)}>
                상태 변경
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6">주문 상태 변경</Typography>
                    <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} fullWidth>
                        <MenuItem value="ORDER">주문 완료</MenuItem>
                        <MenuItem value="SHIPPING">배송중</MenuItem>
                        <MenuItem value="FINISH">배송 완료</MenuItem>
                        <MenuItem value="CANCEL">취소됨</MenuItem>
                    </Select>
                    <Button onClick={handleSubmit} variant="contained" sx={{ marginTop: 2 }}>
                        변경하기
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default OrderStatusUpdate;
