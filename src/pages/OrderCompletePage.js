import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderCompletePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderDetails } = location.state || {};

    const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/';

    // totalAmount가 undefined일 경우 기본값 설정
    const totalAmount = orderDetails?.totalAmount || 0;
    const shippingFee = 2500;

    const formatPrice = (price) => {
        return price.toLocaleString() + "원";
    };

    // useEffect로 orderDetails 로그 출력 (첫 렌더링 때만)
    useEffect(() => {
        if (orderDetails) {
            console.log('Order Details:', orderDetails);
        }
    }, [orderDetails]);

    return (
        <Box sx={{ p: 5 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2, mb: 4 }}>
                주문 완료
            </Typography>

            <Box sx={{ border: '1px solid', borderRadius: '4px', p: 2, width: '50%', margin: '0 auto' }}>
                <Box sx={{ border: '1px solid', borderRadius: '4px', p: 2, mb: 2 }}>
                    <Typography variant="h5" align="center" sx={{ mb: 1 }}>주문된 상품 정보</Typography>
                    <Box sx={{ border: '1px solid', borderRadius: '4px', p: 2 }}>
                        {orderDetails?.products && orderDetails.products.length > 0 ? (
                            orderDetails.products.map((product, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Box sx={{ mr: 1 }}>
                                        <img
                                            src={`${filePath}${product.productImageDtos[0]?.storeName}`}
                                            alt={product.name}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography>상품 이름: {product.name}</Typography>
                                        <Typography>수량: {product.quantity}</Typography>
                                        <Typography>가격: {formatPrice(product.price)}</Typography>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography align="center">주문된 상품이 없습니다.</Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{ border: '1px solid', borderRadius: '4px', p: 2 }}>
                    <Typography variant="h5" align="center" sx={{ mb: 1 }}>주문 상세 정보</Typography>
                    <Box sx={{ border: '1px solid', borderRadius: '4px', p: 2 }}>
                        <Typography>받는 사람: {orderDetails?.recipientName}</Typography>
                        <Typography>배송지: {orderDetails?.shippingAddress}</Typography>
                        <Typography>배송 요청 사항: {orderDetails?.shippingRequest}</Typography>
                        <Typography>배송비: {formatPrice(shippingFee)}</Typography>
                        <Typography>
                            총 주문 금액: {formatPrice(totalAmount)}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" onClick={() => navigate('/')}>
                    홈으로 가기
                </Button>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/mypage')}>
                    마이 페이지 가기
                </Button>
            </Box>
        </Box>
    );
};

export default OrderCompletePage;
