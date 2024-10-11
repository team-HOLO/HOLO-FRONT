import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, TablePagination, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import CategoryList from '../../components/Category/CategoryList';
import CategoryForm from '../../components/Category/CategoryForm';
import DeleteConfirmationDialog from '../../components/Category/DeleteConfirmationDialog';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  const [totalElements, setTotalElements] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  useEffect(() => {
    fetchCategories();
  }, [page, sortOption, searchTerm]);

  const fetchCategories = async () => {
    const [sortBy, direction] = sortOption.split('_');
    try {
      const response = await axios.get('/api/categories/admin', {
        params: {
          page,
          size: 10, // 고정된 페이지 크기
          sortBy,
          direction,
          name: searchTerm,
        },
      });
      setCategories(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleFormSubmit = (newCategory) => {
    axios.post('/api/categories', newCategory)
      .then(() => {
        fetchCategories();
        setFormOpen(false);
      })
      .catch(error => console.error('Error adding category:', error));
  };

  const handleEdit = async (category) => {
    try {
      const response = await axios.get(`/api/categories/details/${category.categoryId}`);
      setSelectedCategory(response.data);
      setFormOpen(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (categoryId) => {
    try {
        await axios.delete(`/api/categories/${categoryId}`);
        setDeleteDialogOpen(false);
        await fetchCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};

  return (
    <Container>
      <h1>카테고리 관리</h1>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
          카테고리 추가
        </Button>
      </Box>
      <CategoryForm open={formOpen} category={selectedCategory} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} />
      <TextField
        label="검색"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <FormControl variant="outlined" style={{ minWidth: '200px', marginBottom: '20px' }}>
        <InputLabel>정렬</InputLabel>
        <Select value={sortOption} onChange={handleSortOptionChange} label="정렬">
          <MenuItem value="name_asc">이름 (오름차순)</MenuItem>
          <MenuItem value="name_desc">이름 (내림차순)</MenuItem>
          <MenuItem value="categoryId_asc">분류코드 (오름차순)</MenuItem>
          <MenuItem value="categoryId_desc">분류코드 (내림차순)</MenuItem>
          <MenuItem value="createdAt_asc">생성일자 (오름차순)</MenuItem>
          <MenuItem value="createdAt_desc">생성일자 (내림차순)</MenuItem>
        </Select>
      </FormControl>
      <CategoryList categories={categories} onEdit={handleEdit} onDelete={handleDeleteClick} />
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
        categoryName={selectedCategory?.name}
        categoryId={selectedCategory?.categoryId}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </Container>
  );
};

export default CategoryManagementPage;
