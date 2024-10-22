import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Checkbox, IconButton, Paper, Divider } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [selectedItems, setSelectedItems] = useState(new Set());
    const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/';
    const shippingFee = 2500; // 배송비 고정

    useEffect(() => {
        const fetchCart = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(storedCart);
        };
        fetchCart();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const detailsPromises = cartItems.map(item =>
                    axios.get(`/api/products/${item.productId}`)
                );
                const responses = await Promise.all(detailsPromises);
                const details = responses.reduce((acc, response, index) => {
                    acc[cartItems[index].productId] = response.data;
                    return acc;
                }, {});
                setProductDetails(details);
            } catch (error) {
                console.error('상품 정보를 가져오는 중 오류 발생:', error);
            }
        };

        if (cartItems.length > 0) {
            fetchProductDetails();
        }
    }, [cartItems]);

    const updateLocalStorage = (updatedCart) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveFromCart = (productId, color, size) => {
        const updatedCart = cartItems.filter(item => !(item.productId === productId && item.color === color && item.size === size));
        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
    };

    const handleQuantityChange = (productId, amount) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            );
            updateLocalStorage(updatedItems);
            return updatedItems;
        });
    };

    const handleSelectItem = (productId) => {
        setSelectedItems(prev => {
            const updated = new Set(prev);
            if (updated.has(productId)) {
                updated.delete(productId);
            } else {
                updated.add(productId);
            }
            return updated;
        });
    };

    const handleDeleteSelectedItems = () => {
        const updatedCart = cartItems.filter(item => !selectedItems.has(item.productId));
        setCartItems(updatedCart);
        setSelectedItems(new Set());
        updateLocalStorage(updatedCart);
    };

    const handleDeleteAllItems = () => {
        setCartItems([]);
        setSelectedItems(new Set());
        localStorage.removeItem('cart');
    };

    // 총 상품 가격 계산
    const totalPrice = cartItems.reduce((total, item) => {
        const product = productDetails[item.productId];
        return product ? total + product.price * item.quantity : total;
    }, 0);

    // 총 수량 계산
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <Box sx={{ padding: 9 }}>
            <Typography variant="h4" gutterBottom>장바구니</Typography>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    {cartItems.length === 0 ? (
                        <Typography variant="h6">장바구니가 비어 있습니다.</Typography>
                    ) : (
                        <>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Checkbox onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedItems(new Set(cartItems.map(item => item.productId)));
                                    } else {
                                        setSelectedItems(new Set());
                                    }
                                }} />
                                <Typography>전체 선택</Typography>
                            </Box>
                            {cartItems.map((item, index) => (
                                <Card key={index} sx={{ marginBottom: 2, padding: '10px' }}>
                                    <CardContent>
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item xs={1}>
                                                <Checkbox 
                                                    checked={selectedItems.has(item.productId)}
                                                    onChange={() => handleSelectItem(item.productId)} 
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                {productDetails[item.productId] && (
                                                    <img
                                                        src={`${filePath}${productDetails[item.productId].productImageDtos[0].storeName}`}
                                                        alt={productDetails[item.productId].name}
                                                        style={{ width: '70px', height: '70px', objectFit: 'cover', marginRight: '10px' }}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography variant="h6">
                                                    {productDetails[item.productId]?.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography>
                                                    {productDetails[item.productId]
                                                        ? `${productDetails[item.productId].price.toLocaleString()}원 × ${item.quantity}`
                                                        : '가격 정보 없음'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton onClick={() => handleQuantityChange(item.productId, -1)}>
                                                    <Remove />
                                                </IconButton>
                                                <Typography display="inline">{item.quantity}</Typography>
                                                <IconButton onClick={() => handleQuantityChange(item.productId, 1)}>
                                                    <Add />
                                                </IconButton>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton onClick={() => handleRemoveFromCart(item.productId, item.color, item.size)}>
                                                    <Delete />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                            <Button variant="contained" color="primary" onClick={handleDeleteSelectedItems} sx={{ mt: 2 }}>
                                선택한 상품 삭제
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleDeleteAllItems} sx={{ mt: 2, marginLeft: '10px' }}>
                                전체 상품 삭제
                            </Button>
                        </>
                    )}
                </Grid>
                <Grid item xs={3}>
                    <Paper sx={{ padding: '20px' }}>
                        <Typography variant="h5" gutterBottom>결제 정보</Typography>
                        <Divider sx={{ marginY: 1 }} /> {/* Divider 추가 */}
                        <Typography variant="h6">상품수: {totalQuantity}개</Typography>
                        <Typography variant="h6">상품 금액: {totalPrice.toLocaleString()}원</Typography>
                        <Typography variant="h6">배송비: {shippingFee.toLocaleString()}원</Typography>
                        <Divider sx={{ marginY: 1 }} /> {/* Divider 추가 */}
                        <Typography variant="h5" sx={{ marginTop: '10px' }}>
                            총 결제 금액: {(totalPrice + shippingFee).toLocaleString()}원
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }}>
                            구매하기
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cart;

