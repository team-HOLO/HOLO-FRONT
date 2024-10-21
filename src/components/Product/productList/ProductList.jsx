import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, Tooltip, CardContent, CardMedia, Pagination, Button, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from 'components/Header';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';

const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/'

const ProductList = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [productSearchCond, setProductSearchCond] = useState(""); //검색어
    const [sortBy, setSortBy] = useState("LATEST");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(20); // 페이지 당 아이템 수 (기본값 20)
    const [zoomedIn, setZoomedIn] = useState(null); // 줌인 상태 관리
    const [currentImages, setCurrentImages] = useState({});

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

                // 초기 이미지 설정
                const initialImages = {};
                response.data.content.forEach(product => {
                    initialImages[product.productId] = product.thumbNailImage[0]?.storeName || '';
                });
                setCurrentImages(initialImages);
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

    const resetButton = () => {
        resetProductListState();
        window.location.reload();
    }

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setPage(1);
        fetchProducts();
        setProductSearchCond("");
    };

    // 페이지 크기 변경 핸들러
    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    useEffect(() => {
        resetProductListState(); // 상태 초기화
        fetchProducts();
    }, [categoryId]); // 카테고리 ID가 변경될 때마다 상태 초기화

    useEffect(() => {
        fetchProducts();
    }, [sortBy, page, pageSize]); // 정렬 기준, 페이지, 페이지 크기 변경 시 데이터 로드

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
        <Box sx={{ padding: '30px 10%' }}>
            {/* 상단 필터 바 */}
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '20px' }}>
                {/* 정렬 기준 및 페이지 크기 선택 */}
                <Grid container item xs={12} sm={6} md={9} spacing={2}>
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
                                <MenuItem value={8}>8개씩 보기</MenuItem>
                                <MenuItem value={12}>12개씩 보기</MenuItem>
                                <MenuItem value={20}>20개씩 보기</MenuItem>
                                <MenuItem value={40}>40개씩 보기</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* 초기화 버튼 추가 */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Tooltip title="검색 조건 초기화" arrow>
                            <Button
                                variant="outlined"
                                size="small" // 버튼 크기를 작게 설정
                                onClick={resetButton} // 초기화 버튼 클릭 시 상태 초기화
                                startIcon={<RefreshIcon />} // 아이콘 추가
                            >
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>

                {/* 상품명 검색 */}
                <Grid container item xs={12} sm={6} md={3} justifyContent="flex-end">
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="키워드 검색"
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
                </Grid>
            </Grid>

            {/* 상품 리스트 */}
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
                                            {product.price} 원
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
