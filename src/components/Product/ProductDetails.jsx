import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate  } from 'react-router-dom';
import { TextField, Button, Box, Grid, Card, CardMedia, CardContent, Typography, MenuItem, Divider } from '@mui/material';
import Carousel from "react-material-ui-carousel";



const ProductDetails = () => {

    const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/';
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    // 상태 관리
    const [selectedOption, setSelectedOption] = useState('');
    const [color, setSelectedColor] = useState('');
    const [size, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [optionError, setOptionError] = useState('');
    const [error, setError] = useState('');

    const [product, setProduct] = useState(null);
    const { productId } = useParams() // URL에서 productId 가져오기

    const handleInputChange = (event) => {
        const value = Math.max(1, Number(event.target.value)); // 최소 1로 설정
        setQuantity(value);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/products/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    
    
    // 장바구니 담기 
const handleAddToCart = async () => {
    if (!color || !size) {
        setOptionError('옵션을 선택해주세요');
        return;
    }
    setOptionError(''); // 오류 메시지 초기화

    try {

        const loginData = await axios.get(
            `${apiUrl}/api/members/check-login`,
            {
                withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
            }
        );
        const isLogin = loginData.data;
    
        if (!isLogin) {
            const confirmed = window.confirm('로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?');
            if (confirmed) {
                navigate('/signIn'); // 사용자가 확인한 경우 로그인 페이지로 이동
            } else {
                // 취소한 경우 추가 작업이 필요 없다면 아무 것도 하지 않음
                window.close(); // 현재 창을 닫음 (브라우저 정책에 따라 동작하지 않을 수 있음)
            }
        }

        // 현재 상품 정보를 가져오기 (예: API 호출 또는 상태에서)
        const productData = await axios.get(`${apiUrl}/api/products/${productId}`); // 상품 정보 가져오기
        const product = productData.data;

        const data = {
            productId,
            quantity,
            color,
            size,
            name: product.name, // 상품 이름 추가
            price: product.price, // 상품 가격 추가
            image: product.image // 상품 이미지 URL 추가
        };

        // 로컬 스토리지에서 현재 장바구니 가져오기
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

        // 장바구니에 상품 추가
        const existingProduct = currentCart.find(item => item.productId === productId && item.color === color && item.size === size);
        if (existingProduct) {
            existingProduct.quantity += quantity; // 수량 증가
        } else {
            currentCart.push({ ...data }); // 새 상품 추가
        }

        // 로컬 스토리지에 저장
        localStorage.setItem('cart', JSON.stringify(currentCart));

        console.log('장바구니에 추가되었습니다:', currentCart);
        console.log('현재 로컬 스토리지:', localStorage.getItem('cart')); // 로컬 스토리지 확인
    } catch (error) {
        console.error('장바구니 추가 중 오류 발생:', error);
    }
}

    
    // const handleAddToCart = async () => {

    //     if (!color || !size) {
    //         setOptionError('옵션을 선택해주세요');
    //         return;
    //     }
    //     setOptionError(''); // 오류 메시지 초기화

    //     const data = {
    //         productId,
    //         quantity,
    //         color,
    //         size,
    //     };
    
    //     try {
    //         const response = await axios.post('/api/cart', data, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         console.log('장바구니에 추가되었습니다:', response.data);

    //         //alert 추가 
    //     } catch (error) {
    //         console.error('장바구니 추가 중 오류 발생:', error);
    //     }
    // };

    //바로 주문 
const handleOrder = async () => {
    if (!color || !size) {
        setOptionError('옵션을 선택해주세요');
        return;
    }
    setOptionError(''); // 오류 메시지 초기화

    // 주문 요청 데이터 구조에 맞춰 수정
    const data = {
        products: [
            {
                productId: productId,
                quantity: quantity,
                color: color,
                size: size,
            },
        ],
        shippingAddress: '', // 빈 문자열로 초기화 (나중에 order 페이지에서 입력)
        recipientName: '',   // 빈 문자열로 초기화
        shippingRequest: '',  // 빈 문자열로 초기화
    };

    try {
        const response = await axios.post(`${apiUrl}/api/orders`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송  
        });

        // 성공적으로 주문 후 order 페이지로 이동
        navigate('/order', {
            state: {
                // 필요한 경우 추가 데이터 전달
                productId,
                quantity,
                color,
                size,
            },
        });

        console.log('주문이 완료되었습니다.', response.data);
    } catch (error) {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            if (window.confirm('로그인 후 이용가능합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
        } else {
            setError('장바구니 담기 중 오류 발생');
        }
    }
};

    if (!product) return <div>Loading...</div>;

    const { name, price, description, productOptions, productImageDtos } = product;
    const thumbnailImages = productImageDtos.filter(img => img.isThumbnail);

    // 총 가격 계산
    const totalPrice = price * quantity;

    // 상품 정보 렌더링
    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Carousel cycleNavigation={true} navButtonsAlwaysVisible={true}>
                            {thumbnailImages.map((img, index) => (
                                <Card key={index} sx={{ position: 'relative' }}>
                                    <CardMedia
                                        height='500'
                                        component="img"
                                        sx={{ objectFit: 'cover', objectPosition: 'center' }}
                                        image={`${filePath}${img.storeName}`}
                                        alt={name}
                                    />
                                </Card>
                            ))}
                        </Carousel>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', padding: '20px', boxShadow: 3, height: '100%' }}>
                            <CardContent sx={{ textAlign: 'left', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                <Typography variant="h2" gutterBottom sx={{ marginBottom: '10px' }}>
                                    {name}
                                </Typography>
                                <Typography variant="h5" color="textSecondary" gutterBottom sx={{ marginBottom: '20px' }}>
                                    판매가: {price.toLocaleString()} 원
                                </Typography>
                                <Divider sx={{ width: '100%', marginBottom: '10px', marginTop: '10px' }} />
                                <Typography variant="body1" sx={{ marginBottom: '70px' }}>
                                    {description}
                                </Typography>
                                <div className="product-options" style={{ width: '100%', marginBottom: '20px' }}>
                                    옵션
                                    <TextField
                                        select
                                        variant="outlined"
                                        size="small"
                                        defaultValue=""
                                        error={!!optionError}
                                        helperText={optionError}
                                        onChange={(e) => {
                                            const [color, size] = e.target.value.split(' / ');
                                            setSelectedColor(color);
                                            setSelectedSize(size);
                                        }}
                                        fullWidth
                                        sx={{ marginTop: '10px' }} // 옵션 바의 위쪽 여백 추가
                                    >
                                        {productOptions.map(option => (
                                            <MenuItem key={option.color + option.size} value={`${option.color} / ${option.size}`}>
                                               색상 : {option.color} / 사이즈 : {option.size}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                {/* 주문 수량 및 총 가격 표시 컨테이너 */}
                                {color && size && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '70px' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                sx={{ minWidth: '30px', width: '30px' }} // 버튼 너비 조정
                                            >
                                                -
                                            </Button>
                                            <TextField
                                                type="number"
                                                value={quantity}
                                                onChange={handleInputChange}
                                                sx={{ width: '70px', margin: '0 10px' }}
                                            />
                                            <Button
                                                variant="outlined"
                                                onClick={() => setQuantity(quantity + 1)}
                                                sx={{ minWidth: '30px', width: '30px' }} // 버튼 너비 조정
                                            >
                                                +
                                            </Button>
                                        </Box>

                                        {/* 총 가격 표시 */}
                                        <Typography variant="h6">
                                            주문 가격: {totalPrice} 원
                                        </Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button variant="contained" color="primary" style={{ marginRight: '20px' }} onClick={handleAddToCart} >
                                        장바구니 담기
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={handleOrder}>
                                        바로 주문하기
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>


            <Box sx={{ marginTop: '100px', textAlign: 'center' }}>
                <Divider sx={{ width: '100%', marginBottom: '10px', marginTop: '10px' }} />
                <Typography variant="h5" gutterBottom>
                    Details
                </Typography>
                <Grid container justifyContent="center" spacing={10}>
                    {productImageDtos.map(image => (
                        <Grid item xs={7} key={image.id} sx={{ width: '50%', margin: 'auto' }}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: 2 }}>
                                <CardMedia
                                    component="img"
                                    image={`${filePath}${image.storeName}`}
                                    alt={image.originName}
                                    sx={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

        </Box>



    );


};

export default ProductDetails;
