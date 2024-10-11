import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// 카테고리 생성, 수정 폼
const CategoryForm = ({ open, category, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [topCategories, setTopCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // 카테고리가 존재하는 경우: 수정
        if (category) {
            setName(category.name);
            setDescription(category.description);
            setParentCategory(category.parentCategory ? category.parentCategory.categoryId : '');
        }
        // 카테고리가 존재하지 않는 경우: 새로 생성
        else {
            setName('');
            setDescription('');
            setParentCategory('');
        }
    }, [category]);

    useEffect(() => {
        // 대분류 카테고리 가져오기
        const fetchTopCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories');
                setTopCategories(response.data);
            } catch (error) {
                console.error('Error fetching top categories:', error);
            }
        };

        fetchTopCategories();
    }, []);

    // 수정 또는 생성 버튼 눌렀을 때 동작
    const handleSubmit = async () => {
        try {
            // CategoryCreateDto랑 동일
            const categoryData = { name, description, parentCategory };
            // 카테고리가 있는 경우
            if (category) {
                try {
                    // 카테고리 수정 api
                    await axios.put(`http://localhost:8080/api/categories/${category.categoryId}`, categoryData);
                } catch (error) {
                    // 409 Conflict 에러 발생
                    if(error.response.status === 409) {
                        setError('이미 존재하는 카테고리명입니다.');
                    } else {
                        // 기타 에러 발생
                        setError('카테고리 수정 중 오류가 발생했습니다.');
                    }
                    return; // 에러 발생 시 함수 종료

                }
            } else {
                try {
                    // 카테고리 생성 api
                    await axios.post('http://localhost:8080/api/categories', categoryData);
                } catch (error) {
                    if(error.response.status === 409) {
                        setError('이미 존재하는 카테고리명입니다.');
                    } else {
                        setError('카테고리 추가 중 오류가 발생했습니다.');
                    }
                    return; // 에러 발생 시 함수 종료
                }
            }
            onClose();
            window.location.reload(); // 페이지 전체를 리로드 -> 업데이트 된 리스트 반영을 위해
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    // 
    const handleParentIdChange = (event) => {
        const value = event.target.value;
        setParentCategory(value === '' ? null : value);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{category ? '카테고리 수정' : '카테고리 추가'}</DialogTitle>
            <DialogContent>
                <Box component="form" mt={2}>
                    <TextField
                        fullWidth
                        label="카테고리명"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        error={!!error} // 에러가 있을 경우 true
                        helperText={error} // 에러 메시지 표시
                    />
                    <TextField
                        fullWidth
                        label="카테고리 설명"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="parent-category-label">대분류 선택</InputLabel>
                        <Select
                            labelId="parent-category-label"
                            value={parentCategory || ''}
                            onChange={handleParentIdChange}
                            label="대분류 선택"
                        >
                            <MenuItem value="">
                                <em>없음</em>
                            </MenuItem>
                            {topCategories.map((topCategory) => (
                                <MenuItem key={topCategory.categoryId} value={topCategory.categoryId}>
                                    {topCategory.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSubmit}>
                    {category ? '수정' : '등록'}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryForm;
