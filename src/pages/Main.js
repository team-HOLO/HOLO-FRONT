import React, { useEffect, useState } from 'react';
import Carousel from "react-material-ui-carousel";
import { Typography, Box, Grid, Pagination } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
// import Pagination from '@mui/material';
import axios from 'axios';
import {Link} from 'react-router-dom';




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
        const response = await axios.get('api/products', {
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

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts(page - 1, 8); // 페이지는 0부터 시작하므로 -1
            setProducts(data.content);
            setTotalPages(data.totalPages);
        };
        loadProducts();
    }, [page]);

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
                                <CardActionArea>
                                    {product.thumbNailImage.length > 0 && (
                                        <CardMedia
                                            component="img"
                                            height="300"
                                            image={`${filePath}${product.thumbNailImage[0].storeName}`} // 썸네일 이미지 URL
                                            alt={product.name}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            쇼파
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            1인용 쇼파
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
