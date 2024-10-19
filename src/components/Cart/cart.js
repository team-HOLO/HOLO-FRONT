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

// 상품 데이터는 id를 통해 가격, 이름 및 이미지를 관리합니다.
const productsData = [
  { id: 1, name: "의자(chair)", price: 29000, image: "chair.jpg" },
  { id: 2, name: "탁자", price: 49000, image: "table.jpg" },
  { id: 3, name: "커튼", price: 30000, image: "curtain.jpg" },
];

// 특정 id의 상품 정보를 가져오는 함수
const getProductById = (id) => {
  return productsData.find((product) => product.id === id);
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // 로컬스토리지에서 장바구니 데이터를 불러옵니다
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 장바구니가 변경될 때 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
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

  // 체크된 아이템 삭제
  const handleDeleteChecked = () => {
    setCart((prevCart) =>
      prevCart.filter((item) => !checkedItems.includes(item.id))
    );
    setCheckedItems([]);
  };

  // 전체 아이템 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cart.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // 상품 추가
  const handleAddProduct = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      handleQuantityChange(product.id, 1);
    } else {
      setCart([...cart, { id: product.id, quantity: 1 }]);
    }
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((itemId) => itemId !== id)
        : [...prevChecked, id]
    );
  };

  // 총 결제 금액 계산 (id를 통해 가격을 가져와 계산)
  const totalPrice = cart.reduce((total, item) => {
    const product = getProductById(item.id);
    return total + product.price * item.quantity;
  }, 0);

  // 배송비는 상품이 있을 때 한 번만 적용
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

          <Box>
            <Checkbox checked={selectAll} onChange={handleSelectAll} />
            <Typography variant="body1" display="inline">
              전체 선택
            </Typography>
          </Box>

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
                          {/* 상품 이미지 추가 */}
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

      {/* 상품 추가 예시 */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          상품 추가하기
        </Typography>
        <Box display="flex" gap={2}>
          {productsData.map((product) => (
            <Button
              key={product.id}
              variant="outlined"
              onClick={() => handleAddProduct(product)}
            >
              {product.name} 추가
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Cart;
