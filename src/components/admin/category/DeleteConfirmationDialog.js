import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DeleteConfirmationDialog = ({ open, categoryName, categoryId, onClose, onDelete }) => {
    const handleDelete = () => {
        onDelete(categoryId);
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{categoryName} 카테고리</DialogTitle>
            <DialogContent>
                정말 삭제하시겠습니까?
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    삭제
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
