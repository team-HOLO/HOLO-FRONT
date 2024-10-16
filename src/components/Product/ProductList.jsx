import Carousel from "react-material-ui-carousel";
import CardActionArea from '@mui/material/CardActionArea';
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Pagination } from '@mui/material';
import axios from 'axios';

const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/'

const fetchProducts = async (page, size) => {
    const response = await axios.get('api/products', {
        params: {
            page: page,
            size: size,
        },
    });
    return response.data;
}

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts(page - 1, 9); // 페이지는 0부터 시작하므로 -1
            setProducts(data.content);
            setTotalPages(data.totalPages);
        };
        loadProducts();
    }, [page]);

    return (
        <div>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.productId}>
                        <Card>
                            {product.thumbNailImage.length > 0 && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`${filePath}${product.thumbNailImage[0].storeName}`} // 썸네일 이미지 URL
                                    alt={product.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.price} 원
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                style={{ marginTop: '20px' }}
            />
        </div>
    );
};

export default ProductList;