import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import Home from "./components/Home";
import AdminPage from "./pages/admin/AdminPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import Footer from "./components/Footer";
import About from "./pages/About";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Main from "./pages/Main";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import axios from "axios";
import ProductList from "./components/Product/productList/ProductList";
import ProductDetails from "./components/Product/ProductDetails";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import MemberUpdatePage from "./pages/MemberUpdate";

import MyPage from "pages/myPage/MyPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#424242",
      contrastText: "#ffffff",
    },
  },
});

function App() {
  const [categories, setCategories] = useState([]);

  const fetchCategoriesHeader = useCallback(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetchCategoriesHeader();
  }, [fetchCategoriesHeader]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header
            isAdmin={true}
            categories={categories}
            refreshCategories={fetchCategoriesHeader}
          />
          <div style={{ flex: 1, paddingBottom: "60px" }}>
            {" "}
            {/* Footer 높이만큼 여백 추가 */}
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:productId" element={<ProductDetails />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/admin" element={<AdminPage />}>
                <Route index element={<AdminDashboard />} />
                <Route
                  path="categories"
                  element={
                    <CategoryManagementPage
                      refreshCategories={fetchCategoriesHeader}
                    />
                  }
                />
                <Route path="members" element={<Home />} />
                <Route path="orders" element={<Home />} />
                <Route path="products" element={<ProductManagementPage />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/memberupdate" element={<MemberUpdatePage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
