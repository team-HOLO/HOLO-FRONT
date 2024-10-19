import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Checkbox,
  IconButton,
  Card,
  Grid,
  CardContent,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";

import { Add, Remove, Delete } from "@mui/icons-material";

// 상품목록에서 장바구니 담기 추가하면 이 부분을 빼겠습니다.
const productsData = [
  { id: 1, name: "의자", price: 29000, image: "chair.jpg", quantity: 1 },
  { id: 2, name: "탁자", price: 49000, image: "table.jpg", quantity: 1 },
  { id: 3, name: "커튼", price: 30000, image: "curtain.jpg", quantity: 1 },
];

const getProductById = (id) => {
  return productsData.find((product) => product.id === id);
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  // 로컬스토리지에서 장바구니 데이터를 불러옵니다.
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 장바구니가 변경될 때 로컬스토리지에 저장합니다.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    // 장바구니가 비었을 때 알림을 표시합니다.
    if (cart.length === 0) {
      setShowEmptyAlert(true);
    } else {
      setShowEmptyAlert(false);
    }
  }, [cart]);

  // 수량 변경 함수
  const handleQuantityChange = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // 아이템 삭제 함수
  const handleDelete = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 선택된 아이템 삭제
  const handleDeleteChecked = () => {
    setCart((prevCart) =>
      prevCart.filter((item) => !checkedItems.includes(item.id))
    );
    setCheckedItems([]);
    setSelectAll(false);
  };

  // 전체 선택 / 해제
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cart.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // 체크박스 변경 처리
  const handleCheckboxChange = (id) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((itemId) => itemId !== id)
        : [...prevChecked, id]
    );
  };

  // 총 결제 금액 계산
  const totalPrice = cart.reduce((total, item) => {
    const product = getProductById(item.id);
    return total + product.price * item.quantity;
  }, 0);

  // 배송비 계산
  const shippingFee = cart.length > 0 ? 2500 : 0;

  // 총 상품 수 계산
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between">
        <Box width="65%">
          <Typography variant="h4" gutterBottom>
            장바구니
          </Typography>

          {/* 장바구니가 비었을 때 경고 메시지 표시 */}
          {showEmptyAlert && (
            <Alert severity="warning" style={{ marginBottom: "20px" }}>
              장바구니에 상품이 없습니다.
            </Alert>
          )}

          {/* 전체 선택 체크박스 */}
          <Box>
            <Checkbox checked={selectAll} onChange={handleSelectAll} />
            <Typography variant="body1" display="inline">
              전체 선택
            </Typography>
          </Box>

          {/* 상품 리스트 */}
          <Grid container spacing={2}>
            {cart.map((item) => {
              const product = getProductById(item.id);
              return (
                <Grid item xs={12} key={item.id}>
                  <Card>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={1}>
                          <Checkbox
                            checked={checkedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{product.name}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>
                            {product.price.toLocaleString()}원 x {item.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Add />
                          </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick={() => handleDelete(item.id)}>
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

          {/* 선택된 항목 삭제 및 전체 삭제 버튼 */}
          <Button
            variant="contained"
            style={{ backgroundColor: "black", color: "white", marginRight: 10 }}
            onClick={handleDeleteChecked}
          >
            선택된 항목 삭제
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "black", color: "white" }}
            onClick={() => setCart([])}
          >
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
              style={{ backgroundColor: "black", color: "white" }}
              fullWidth
            >
              구매하기
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart;
