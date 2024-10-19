import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Checkbox,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const App = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // 로컬스토리지에서 장바구니 데이터를 불러옵니다
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("로컬 스토리지에서 가져온 장바구니:", storedCart);
    setCart(storedCart);

    // 예시 상품 데이터 로드 (실제로는 API에서 받아올 수 있습니다)
    const storedProducts = [
      { id: 1, name: "의자", price: 10000, image: "image1_url" },
      { id: 2, name: "소파", price: 20000, image: "image2_url" },
      { id: 3, name: "탁자", price: 30000, image: "image3_url"},
      // 추가 상품...
    ];
    setProducts(storedProducts);
  }, []);

  // 장바구니가 변경될 때 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 수량 변경 함수
  const handleQuantityChange = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // 아이템 삭제 함수
  const handleDelete = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== id));
  };

  // 체크된 아이템 삭제
  const handleDeleteChecked = () => {
    setCart((prevCart) =>
      prevCart.filter((item) => !checkedItems.includes(item.productId))
    );
    setCheckedItems([]);
  };

  // 전체 아이템 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cart.map((item) => item.productId));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((itemId) => itemId !== id)
        : [...prevChecked, id]
    );
  };

  // 상품 추가 함수
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { productId: product.id, quantity: 1 }];
      }
    });
  };

  // 상품 정보를 가져오는 함수
  const getProductById = (id) => {
    return products.find((product) => product.id === id);
  };

  // 총 결제 금액 계산
  const totalPrice = cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price : 0) * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const shippingFee = 3000; // 배송비 설정

  return (
    <Container>
      <Box display="flex" justifyContent="space-between">
        <Box width="65%">
          <Typography variant="h4" gutterBottom>
            장바구니
          </Typography>

          <Box>
            <Checkbox checked={selectAll} onChange={handleSelectAll} />
            <Typography variant="body1" display="inline">
              전체 선택
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {cart.map((item) => {
              const product = getProductById(item.productId);
              return (
                <Grid item xs={12} key={item.productId}>
                  <Card>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={1}>
                          <Checkbox
                            checked={checkedItems.includes(item.productId)}
                            onChange={() => handleCheckboxChange(item.productId)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          {product ? (
                            <img
                              src={product.image} // 상품 이미지
                              alt={product.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            <Typography>상품 정보 없음</Typography>
                          )}
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{product ? product.name : "상품 정보 없음"}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>
                            {product ? `${product.price.toLocaleString()}원 x ${item.quantity}` : "가격 정보 없음"}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.productId, -1)}
                          >
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item.productId, 1)}
                          >
                            <Add />
                          </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick={() => handleDelete(item.productId)}>
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Button variant="contained" onClick={handleDeleteChecked}>
            선택된 항목 삭제
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setCart([])}>
            전체 삭제
          </Button>
        </Box>

        {/* 결제 정보 */}
        <Box width="30%">
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              결제 정보
            </Typography>
            <Typography>상품 수: {totalItems}개</Typography>
            <Typography>상품 금액: {totalPrice.toLocaleString()}원</Typography>
            <Typography>배송비: {shippingFee.toLocaleString()}원</Typography>
            <Typography>
              총 결제 금액: {(totalPrice + shippingFee).toLocaleString()}원
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "16px" }}
            >
              구매하기
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* 상품 리스트 */}
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        상품 목록
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <img src={product.image} alt={product.name} style={{ width: "100%" }} />
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1">{product.price.toLocaleString()}원</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                >
                  장바구니에 담기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
