import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import AdminMenu from "components/admin/AdminMenu";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const menuItems = [
    {
      image: "images/orders.svg",
      title: "주문 관리",
      desc: "주문 조회, 상태 변경, 취소",
      link: "orders",
    },
    {
      image: "images/products.svg",
      title: "상품 관리",
      desc: "상품 조회, 추가, 수정, 삭제",
      link: "products",
    },
    {
      image: "/images/category.svg",
      title: "카테고리 관리",
      desc: "카테고리 조회, 추가, 수정, 삭제",
      link: "categories",
    },
  ];

  return (
    <Box
      sx={{
        display: "static",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // 화면의 높이만큼 꽉 채움
        padding: "2rem",
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} xl={2} key={index}>
            <Link
              to={`/admin/${item.link}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Paper
                elevation={3}
                sx={{
                  borderRadius: "8px",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <AdminMenu
                  image={item.image}
                  title={item.title}
                  desc={item.desc}
                  sx={{
                    width: "80%",
                    height: "auto",
                    maxWidth: "250px",
                    margin: "0 auto",
                  }}
                />
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
