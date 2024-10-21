import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, TablePagination, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import ProductItem from '../../components/Product/ProductIem';
import ProductListAdmin from '../../components/Product/ProductListAdmin';
import ProductList from '../../components/Product/productList/ProductList';
import DeleteConfirmationDialog from 'components/admin/category/DeleteConfirmationDialog';
import ProductForm from '../../components/Product/ProductForm';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
      try {
      const response = await axios.get('/api/admin/products', {
        params: {
          page,
          size: 10, // 고정된 페이지 크기
        },
      });
      setProducts(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleFormSubmit = (newProduct) => {
    axios.post('/api/products', newProduct)
      .then(() => {
        fetchProducts();
        setFormOpen(false);
      })
      .catch(error => console.error('Error adding product:', error));
  };

  const handleEdit = async (product) => {
    try {
      const response = await axios.get(`/api/products/${product.productId}`);
      setSelectedProduct(response.data);
      setFormOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (productId) => {
    try {
        await axios.delete(`/api/products/${productId}`);
        setDeleteDialogOpen(false);
        await fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

  return (
    <Container>
      <h1>상품 관리</h1>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
          상품 추가
        </Button>
      </Box>
      <ProductForm open={formOpen} product={selectedProduct} onClose={() => setFormOpen(false)}  onSubmit={handleFormSubmit}/>

      <ProductListAdmin products={products} onEdit={handleEdit} onDelete={handleDeleteClick} />
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={10} // 고정된 페이지 크기
        rowsPerPageOptions={[]} // 선택 옵션 제거
      />
    <DeleteConfirmationDialog
        open={deleteDialogOpen}
        categoryName={selectedProduct?.name}
        categoryId={selectedProduct?.productId}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </Container>
  );
};

export default ProductManagementPage;
