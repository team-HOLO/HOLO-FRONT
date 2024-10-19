import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Pagination, Button, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from 'components/Header';

const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/'

const ProductList = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [productSearchCond, setProductSearchCond] = useState(""); //검색어
    const [sortBy, setSortBy] = useState("LATEST");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(20); // 페이지 당 아이템 수 (기본값 20)

    // API 호출 함수
    const fetchProducts = () => {
        axios.get(`/api/products/category/${categoryId}`, {
            params: {
                productName: productSearchCond,
                sortBy: sortBy,
                page: page - 1,
                size: pageSize,
            }
        })
            .then(response => {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => {
                console.error("Error fetching products", error);
            });
    };

    // 상태 초기화 함수
    const resetProductListState = () => {
        setProductSearchCond("");
        setSortBy("LATEST");
        setPage(1);
        setPageSize(20);
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setPage(1);
        fetchProducts();
    };

    // 페이지 크기 변경 핸들러
    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    useEffect(() => {
        resetProductListState(); // 상태 초기화
        fetchProducts(); // 초기 데이터 로드
    }, [categoryId]); // 카테고리 ID가 변경될 때마다 상태 초기화

    // 컴포넌트가 처음 마운트될 때 데이터 불러오기
    useEffect(() => {
        fetchProducts();
    }, [sortBy, page, pageSize]); // 정렬 기준, 페이지, 페이지 크기 변경 시 데이터 로드

    return (
        <Box sx={{ padding: '30px 10%' }}>

            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
                {/* 상품명 검색 */}
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        label="상품명 검색"
                        value={productSearchCond}
                        onChange={(e) => setProductSearchCond(e.target.value)} // 검색어 상태 업데이트
                        variant="outlined"
                        fullWidth
                        sx={{ marginRight: 1 }} // 오른쪽 여백 추가
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch} // 검색 버튼 클릭 시 handleSearch 호출
                    >
                        검색
                    </Button>
                </Grid>

                {/* 정렬 기준 선택 */}
                <Grid item xs={6} sm={3} md={2}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>정렬 기준</InputLabel>
                        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="정렬 기준">
                            <MenuItem value="LATEST">상품 등록순</MenuItem>
                            <MenuItem value="NAME">이름순</MenuItem>
                            <MenuItem value="PRICE_ASC">가격 낮은 순</MenuItem>
                            <MenuItem value="PRICE_DESC">가격 높은 순</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* 페이지 크기 선택 */}
                <Grid item xs={6} sm={3} md={2}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>페이지 당 상품 수</InputLabel>
                        <Select value={pageSize} onChange={handlePageSizeChange} label="페이지 당 상품 수">
                            <MenuItem value={20}>20개씩 보기</MenuItem>
                            <MenuItem value={40}>40개씩 보기</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>


            {/* 상품 리스트 */}
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
                                            image={`${filePath}${product.thumbNailImage[0].storeName}`} // 썸네일 이미지 경로
                                            alt={product.name}
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

            {/* 페이지네이션 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );

};

export default ProductList;