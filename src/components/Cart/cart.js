import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Checkbox, IconButton, Paper, Divider } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [selectedItems, setSelectedItems] = useState(new Set());
    const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/';
    const shippingFee = 2500; // 배송비 고정
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchCart = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(storedCart);
        };

        const fetchSelectedItems = () => {
            const storedSelected = JSON.parse(localStorage.getItem('selectedItems')) || [];
            setSelectedItems(new Set(storedSelected));
        };

        fetchCart();
        fetchSelectedItems();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const detailsPromises = cartItems.map(item =>
                    axios.get(`${apiUrl}/api/products/${item.productId}`)
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

    const updateSelectedItemsInStorage = (updatedSelected) => {
        localStorage.setItem('selectedItems', JSON.stringify(Array.from(updatedSelected)));
    };

    const handleRemoveFromCart = (productId, color, size) => {
        const updatedCart = cartItems.filter(item => !(item.productId === productId && item.color === color && item.size === size));
        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
    };

    const handleQuantityChange = (productId, color, size, amount) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
                item.productId === productId && item.color === color && item.size === size
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            );
            updateLocalStorage(updatedItems);
            return updatedItems;
        });
    };

    const handleSelectItem = (productId, color, size) => {
        const key = `${productId}-${color}-${size}`;
        setSelectedItems(prev => {
            const updated = new Set(prev);
            if (updated.has(key)) {
                updated.delete(key);
            } else {
                updated.add(key);
            }
            updateSelectedItemsInStorage(updated);
            return updated;
        });
    };

    const handleDeleteSelectedItems = () => {
        const updatedCart = cartItems.filter(item => {
            const key = `${item.productId}-${item.color}-${item.size}`;
            return !selectedItems.has(key);
        });
        setCartItems(updatedCart);
        setSelectedItems(new Set());
        updateLocalStorage(updatedCart);
        updateSelectedItemsInStorage(new Set());
    };

    const handleDeleteAllItems = () => {
        setCartItems([]);
        setSelectedItems(new Set());
        localStorage.removeItem('cart');
        localStorage.removeItem('selectedItems');
    };

    // 총 상품 가격 계산 (체크된 상품만 포함)
    const totalPrice = cartItems.reduce((total, item) => {
        const product = productDetails[item.productId];
        const key = `${item.productId}-${item.color}-${item.size}`;
        if (selectedItems.has(key) && product) {
            return total + product.price * item.quantity;
        }
        return total;
    }, 0);

    // 총 수량 계산 (체크된 상품만 포함)
    const totalQuantity = cartItems.reduce((total, item) => {
        const key = `${item.productId}-${item.color}-${item.size}`;
        return selectedItems.has(key) ? total + item.quantity : total;
    }, 0);

    // 체크된 상품만 주문 페이지로 이동
    const handleProceedToOrder = () => {
        const selectedProducts = cartItems.filter(item => {
            const key = `${item.productId}-${item.color}-${item.size}`;
            return selectedItems.has(key);
        });

        // 주문 페이지로 이동하며 선택한 상품들 전달
        navigate('/order', { state: { selectedProducts } });
    };

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
                                <Checkbox 
                                    checked={cartItems.length > 0 && cartItems.every(item => {
                                        const key = `${item.productId}-${item.color}-${item.size}`;
                                        return selectedItems.has(key);
                                    })}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            const allSelected = new Set();
                                            cartItems.forEach(item => {
                                                const key = `${item.productId}-${item.color}-${item.size}`;
                                                allSelected.add(key);
                                            });
                                            setSelectedItems(allSelected);
                                            updateSelectedItemsInStorage(allSelected);
                                        } else {
                                            setSelectedItems(new Set());
                                            updateSelectedItemsInStorage(new Set());
                                        }
                                    }} 
                                />
                                <Typography>전체 선택</Typography>
                            </Box>

                            {cartItems.map((item, index) => {
    const key = `${item.productId}-${item.color}-${item.size}`;
    return (
        <Card key={index} sx={{ marginBottom: 2, padding: '10px' }}>
            <CardContent>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={1}>
                        <Checkbox 
                            checked={selectedItems.has(key)}
                            onChange={() => handleSelectItem(item.productId, item.color, item.size)} 
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
                        <Typography variant="body2">색상: {item.color}</Typography>
                        <Typography variant="body2">사이즈: {item.size}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                            {productDetails[item.productId]
                                ? `${productDetails[item.productId].price.toLocaleString()}원 × ${item.quantity}`
                                : '가격 정보 없음'}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => handleQuantityChange(item.productId, item.color, item.size, -1)}>
                            <Remove />
                        </IconButton>
                        <Typography display="inline">{item.quantity}</Typography>
                        <IconButton onClick={() => handleQuantityChange(item.productId, item.color, item.size, 1)}>
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
    );
})}

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
                        <Divider sx={{ marginY: 1 }} />
                        <Typography variant="h6">상품수: {totalQuantity}개</Typography>
                        <Typography variant="h6">상품 금액: {totalPrice.toLocaleString()}원</Typography>
                        <Typography variant="h6">배송비: {shippingFee.toLocaleString()}원</Typography>
                        <Divider sx={{ marginY: 1 }} />
                        <Typography variant="h5" sx={{ marginTop: '10px' }}>
                            총 결제 금액: {(totalPrice + shippingFee).toLocaleString()}원
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            sx={{ marginTop: '20px' }} 
                            onClick={handleProceedToOrder} // 선택된 상품으로 주문 페이지로 이동
                        >
                            구매하기
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cart;
