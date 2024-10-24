import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button} from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL;

const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 주문 항목 상태
    const [orderItems, setOrderItems] = useState([]);
    const [productDetails, setProductDetails] = useState([]);

    // 사용자 정보 상태
    const [shippingAddress, setShippingAddress] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [shippingRequest, setShippingRequest] = useState('');
    const [orderError, setOrderError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/';
    const itemsPerPage = 3;
    const shippingFee = 2500;

      // 초기 주문 항목 설정 및 로컬스토리지에서 가져오기
        useEffect(() => {
            // 장바구니에서 선택된 상품이 있는 경우 처리
            const storedOrder = location.state?.selectedProducts
                // 상품 페이지에서 개별 상품 구매
                || (location.state?.productId
                    ? [{
                        productId: location.state.productId,
                        quantity: location.state.quantity,
                        color: location.state.color,
                        size: location.state.size
                    }]
                    : JSON.parse(localStorage.getItem('cart')) || []);

            setOrderItems(storedOrder);
        }, [location.state]);
    // 주문 상품 상세 정보 가져오기
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productDetailsPromises = orderItems.map(item =>
                    axios.get(`${apiUrl}/api/products/${item.productId}`)
                );
                const responses = await Promise.all(productDetailsPromises);
                setProductDetails(responses.map(response => response.data));
            } catch (error) {
                console.error('상품 정보를 가져오는 중 오류 발생:', error);
            }
        };

        if (orderItems.length > 0) fetchProductDetails();
    }, [orderItems]);
   // 주문 처리
    const handleOrder = async () => {
        setOrderError(''); // 초기화


        if (!shippingAddress || !recipientName) {
            setOrderError('배송지와 받는 사람의 이름을 입력해주세요');
            return;
        }

        // OrderRequestDto에
        const data = {
            products: orderItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
            })),
            shippingAddress,
            recipientName,
            shippingRequest,
        };

        try {
            const response = await axios.post
            (`${apiUrl}/api/orders`, data, {
                headers: { 'Content-Type': 'application/json'
                },
            withCredentials: true,   // 쿠키에 저장된 JWT를 자동으로 전송
            });

            console.log('주문 성공:', response.data);
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = cart.filter(item =>
                !orderItems.some(orderItem => orderItem.productId === item.productId)
            );
            // 주문 후 로컬스토리지 비우기
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            //총가격 계산
            const totalAmount = productDetails.reduce((total, product, index) => {
                const itemPrice = product.price * orderItems[index].quantity;
                return total + itemPrice;
            }, 0) + shippingFee;

           // 수량 정보를 productDetails와 결합
            const orderProductsWithQuantity = productDetails.map((product, index) => ({
                      ...product,
                      quantity: orderItems[index].quantity, // 수량 추가
                  }));
            navigate('/ordercomplete', {
                state: {
                    orderDetails: {
                        products: orderProductsWithQuantity,
                        shippingRequest,
                        shippingAddress,
                        recipientName,
                        totalAmount,
                    },
                },
            });
        } catch (error) {
            console.error('주문 중 오류 발생:', error);

            if (error.response && error.response.status === 400) {
                // 재고 부족 예외 처리
                if (error.response.data.message || '재고가 부족합니다.') {
                    setOrderError('주문하신 상품의 재고가 부족합니다.');
                } else {
                    setOrderError(error.response.data.message || '주문 중 오류가 발생했습니다.');
                }
            } else {
                setOrderError('주문 중 오류가 발생했습니다.');
            }
        }
    };

    // 페이지네이션 관련 변수
    const totalPages = Math.ceil(productDetails.length / itemsPerPage);
    const currentProducts = productDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPrice = productDetails.reduce((total, product, index) => {
        return total + (product.price * orderItems[index].quantity); // 상품 가격 계산
    }, 0);
    const totalAmount = totalPrice + shippingFee;

    // 가격 포맷팅 함수
    const formatPrice = (price) => price.toLocaleString('ko-KR') + "원";

    return (
        <Box sx={{ p: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                주문하기
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: '0 100px' }}>
                {/* 상품 정보 섹션 */}
                <Box sx={{ flex: 1, mr: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5">상품 정보</Typography>
                    </Box>

                    {productDetails.length === 0 ? (
                        <Typography>상품 정보를 불러오는 중...</Typography>
                    ) : (
                        currentProducts.map((product, index) => (
                            <Box key={index} sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={`${filePath}${product.productImageDtos[0]?.storeName}`}
                                        alt={product.name}
                                        style={{ width: '190px', height: '190px', objectFit: 'cover' }}
                                    />
                                    <Box>
                                        <Typography>상품 이름: {product.name}</Typography>
                                        <Typography>수량: {orderItems[index].quantity}</Typography>
                                        <Typography>색상: {orderItems[index].color}</Typography>
                                        <Typography>사이즈: {orderItems[index].size}</Typography>
                                        <Typography>가격: {formatPrice(product.price * orderItems[index].quantity)}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    )}

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="outlined"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                이전
                            </Button>
                            <Typography sx={{ mx: 2 }}>{currentPage} / {totalPages}</Typography>
                            <Button
                                variant="outlined"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                다음
                            </Button>
                        </Box>
                    )}
                </Box>


                <Box sx={{ flex: 1, mt: 10 }}>
                    <Box sx={{ mb: 10 }}>
                        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                            <Typography variant="h5">사용자 정보</Typography>
                            <TextField
                                label="받는 사람"
                                fullWidth
                                placeholder="받는 사람의 이름을 입력하세요"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="주소"
                                fullWidth
                                placeholder="배송지 주소를 입력하세요"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="배송 요청 사항"
                                fullWidth
                                placeholder="특별한 요청 사항이 있으면 입력하세요"
                                value={shippingRequest}
                                onChange={(e) => setShippingRequest(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                            {orderError && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {orderError}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                            <Typography variant="h5">주문 확인</Typography>
                            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                                <Typography>
                                    상품 가격: {formatPrice(totalPrice)}
                                </Typography>
                                <Typography>배송비: {formatPrice(shippingFee)}</Typography>
                                <Typography>
                                    총 주문 금액: {formatPrice(totalAmount)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                                <Button variant="contained" color="primary" onClick={handleOrder}>
                                    구매하기
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    뒤로가기
                </Button>
            </Box>
        </Box>
    );
};

export default OrderPage;
