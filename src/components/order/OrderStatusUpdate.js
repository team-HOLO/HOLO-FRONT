import React, { useState } from 'react';
import { Button, Modal, Box, MenuItem, Select, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function OrderStatusUpdate({ orderId,currentStatus, onUpdateStatus }) {
    const [newStatus, setNewStatus] = useState('ORDER');
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        onUpdateStatus(orderId, newStatus);
        setMessage(`상태가 ${newStatus}로 변경되었습니다.`);
        setSnackbarOpen(true);
        handleClose();  // 모달 닫기
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                상태 변경
            </Button>
             <Typography variant="body1" sx={{ display: 'inline', marginLeft: 1 }}>
              {currentStatus}
                        </Typography>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        주문 상태 변경
                    </Typography>
                    <Select value={newStatus} onChange={handleStatusChange} fullWidth>
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
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default OrderStatusUpdate;