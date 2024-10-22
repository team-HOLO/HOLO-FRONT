import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Container, TextField, TablePagination, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import CategoryList from 'components/admin/category/CategoryList';
import CategoryForm from 'components/admin/category/CategoryForm';
import DeleteConfirmationDialog from 'components/admin/category/DeleteConfirmationDialog';

const sortOptions = [
  { value: 'name_asc', label: '이름 (오름차순)' },
  { value: 'name_desc', label: '이름 (내림차순)' },
  { value: 'categoryId_asc', label: '분류코드 (오름차순)' },
  { value: 'categoryId_desc', label: '분류코드 (내림차순)' },
  { value: 'createdAt_asc', label: '생성일자 (오름차순)' },
  { value: 'createdAt_desc', label: '생성일자 (내림차순)' },
];

const apiUrl = process.env.REACT_APP_API_URL;

const CategoryManagementPage = ({ refreshCategories }) => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  const [totalElements, setTotalElements] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const fetchCategories = useCallback(async () => {
    const [sortBy, direction] = sortOption.split('_');
    try {
      const response = await axios.get(`${apiUrl}/api/admin/categories`, {
        params: {
          page,
          size: 10, // 고정된 페이지 크기
          sortBy,
          direction,
          name: searchTerm,
        },
        withCredentials: true,
      });
      setCategories(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [page, sortOption, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null); // 새로운 카테고리 추가 시 선택된 카테고리 초기화
    setFormOpen(true); // 폼 열기
  };

  const handleFormClose = () => {
    setSelectedCategory(null); // 폼이 닫힐 때 선택된 카테고리 초기화
    refreshCategories(); // 헤더의 카테고리 목록을 새로고침
    setFormOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleFormSubmit = async (newCategory) => {
    try {
      await axios.post(`${apiUrl}/api/categories`, { newCategory }, { withCredentials: true });
      await fetchCategories(); // 새 카테고리 목록을 먼저 가져옴
      handleFormClose();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEdit = async (category) => {
    try {
      const response = await axios.get(
          `${apiUrl}/api/admin/categories/details/${category.categoryId}` , {
        withCredentials: true,
      });
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
      await axios.delete(`${apiUrl}/api/admin/categories/${categoryId}`, { withCredentials: true
      });
      await fetchCategories();
      refreshCategories();
      handleFormClose();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };


  return (
    <Container>
      <h1>카테고리 관리</h1>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          카테고리 추가
        </Button>
      </Box>
      <CategoryForm open={formOpen} category={selectedCategory} fetchCategories={fetchCategories} onClose={handleFormClose} onSubmit={handleFormSubmit} />
      <TextField
        label="검색"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <FormControl variant="outlined" style={{ minWidth: '200px', marginBottom: '20px' }}>
        <InputLabel>정렬</InputLabel>
        <Select value={sortOption} onChange={handleSortOptionChange} label="정렬" variant='outlined'>
          {
            sortOptions.map((option) => (
                <MenuItem key={option.value} value = {option.value}>
                  {option.label}
                </MenuItem>
            ))
          }
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

