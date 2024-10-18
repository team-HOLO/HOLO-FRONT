import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const OrderProductItem = ({ item }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        // 상품 상세 페이지로 이동 (예: /products/{productId})
        navigate(`/products/${item.productId}`);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>

            {/* 상품 정보 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* 상품 이름과 가격 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        onClick={handleProductClick} // 상품명 클릭 시 이동
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                        {item.productName}
                    </Typography>
                </Box>
                {/* 상품 옵션 (색상, 사이즈) 및 수량 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        색상: {item.color ? item.color : '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        사이즈: {item.size ? item.size : '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        수량: {item.quantity}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderProductItem;
