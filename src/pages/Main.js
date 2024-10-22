import React, { useEffect, useState } from 'react';
import Carousel from "react-material-ui-carousel";
import { Typography, Box, Grid, Pagination } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
// import Pagination from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';


const apiUrl = process.env.REACT_APP_API_URL;

function Main() {
    const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/';

    const carouselList = [
        {
            title: "가구",
            url: 'images/main_image1.jpg'
        },
        {
            title: "주방",
            url: 'images/main_image2.jpg'
        },
        {
            title: "소품",
            url: 'images/main_image3.jpg'
        }
    ];

    const fetchProducts = async (page, size) => {
        const response = await axios.get(`${apiUrl}/api/products`, {
            params: {
                page: page,
                size: size,
            },
        });
        return response.data;
    }


    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentImages, setCurrentImages] = useState({}); // 각 제품의 현재 이미지를 저장할 객체
    const [zoomedIn, setZoomedIn] = useState(null); // 줌인 상태 관리

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts(page - 1, 8);
            setProducts(data.content);
            setTotalPages(data.totalPages);
            // 초기 이미지 설정
            const initialImages = {};
            data.content.forEach(product => {
                initialImages[product.productId] = product.thumbNailImage[0]?.storeName || '';
            });
            setCurrentImages(initialImages);
        };
        loadProducts();
    }, [page]);

    const handleMouseEnter = (productId) => {
        setCurrentImages((prevImages) => ({
            ...prevImages,
            [productId]: products.find(product => product.productId === productId).thumbNailImage[1]?.storeName || '',
        }));
    };

    const handleMouseLeave = (productId) => {
        setCurrentImages((prevImages) => ({
            ...prevImages,
            [productId]: products.find(product => product.productId === productId).thumbNailImage[0]?.storeName || '',
        }));
    };



    return (
        <>
         <Carousel cycleNavigation={true} navButtonsAlwaysVisible={true}>
                {carouselList.map((carousel, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                        <img
                            src={carousel.url}
                            alt={carousel.title}
                            style={{
                                height: '50vh',
                                width: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                filter: 'brightness(50%)', // 이미지 밝기 조정
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>HOLO</Typography>
                            <Typography variant="h6">Home Organization & Lifestyle Optimization</Typography>
                        </Box>
                    </Box>
                ))}
            </Carousel>
            <Box sx={{ padding: '30px 10%' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>New Arrivals</Typography>
                <Grid container spacing={7}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
                            <Link to={`/products/${product.productId}`} style={{ textDecoration: 'none' }}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea
                                        onMouseEnter={() => {
                                            if (product.thumbNailImage.length === 1) {
                                                setZoomedIn(product.productId); // 줌인 상태 설정
                                            } else {
                                                handleMouseEnter(product.productId);
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (product.thumbNailImage.length === 1) {
                                                setZoomedIn(null); // 줌인 상태 해제
                                            } else {
                                                handleMouseLeave(product.productId);
                                            }
                                        }}
                                    >
                                        {product.thumbNailImage.length > 0 && (
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={`${filePath}${currentImages[product.productId]}`} // 현재 보여줄 이미지 URL
                                                alt={product.name}
                                                style={{
                                                    transition: 'transform 0.3s',
                                                    transform: zoomedIn === product.productId ? 'scale(1.1)' : 'scale(1)', // 줌인 효과
                                                }}
                                            />
                                        )}
                                        <CardContent>
                                            <Typography variant="h6">{product.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.price.toLocaleString()} 원
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            </Box>
        </>
    );

}

export default Main;
