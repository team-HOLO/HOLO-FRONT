import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, TablePagination, Typography, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import ProductItem from '../../components/Product/ProductIem';
import ProductListAdmin from '../../components/Product/ProductListAdmin';
import ProductList from '../../components/Product/productList/ProductList';
import DeleteProductConfirmationDialog from 'components/Product/DeleteProductConfirmationDialog';
import ProductForm from '../../components/Product/ProductForm';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(''); // 에러 상태 추가
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/products`,
        {
          withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
          params: {
            page,
            size: 10, // 고정된 페이지 크기
          },
        });
      setProducts(response.data.content);
      setTotalElements(response.data.totalElements);
      setError(''); // 성공시 에러 초기화
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setError('관리자 전용 페이지'); // 에러 메시지 설정
      }
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleFormSubmit = (newProduct) => {
    axios.post(`${apiUrl}/api/admin/products`,
      {
        withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
      },
      newProduct)
      .then(() => {
        fetchProducts();
        setFormOpen(false);
      })
      .catch(error => {
        console.error('Error adding product:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setError('관리자 전용 페이지'); // 에러 메시지 설정
        }
      });
  };

  const handleEdit = async (product) => {
    try {
      const response = await axios.get(`${apiUrl}/api/products/${product.productId}`,
        {
          withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
        }
      );
      setSelectedProduct(response.data);
      setFormOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setError('관리자 전용 페이지'); // 에러 메시지 설정
      }
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (productId) => {
    try {
      await axios.delete(`${apiUrl}/api/admin/products/${productId}`,
        {
          withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
        }
      );
      setDeleteDialogOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setError('관리자 전용 페이지'); // 에러 메시지 설정
      }
    }
  };

  return (
    <Container>
      {error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h5" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          <h1>상품 관리</h1>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
              상품 추가
            </Button>
          </Box>
          <ProductForm
            open={formOpen}
            product={selectedProduct}
            onClose={() => {
              setFormOpen(false);
              window.location.reload();
            }}
            onSubmit={handleFormSubmit}
          />
          <ProductListAdmin products={products} onEdit={handleEdit} onDelete={handleDeleteClick} />
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={10} // 고정된 페이지 크기
            rowsPerPageOptions={[]} // 선택 옵션 제거
          />
          <DeleteProductConfirmationDialog
            open={deleteDialogOpen}
            productName={selectedProduct?.name}
            productId={selectedProduct?.productId}
            onClose={() => setDeleteDialogOpen(false)}
            onDelete={handleDeleteConfirm}
          />
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </Container>
  );
};

export default ProductManagementPage;