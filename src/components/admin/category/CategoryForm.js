import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// 카테고리 생성, 수정 폼
const apiUrl = process.env.REACT_APP_API_URL;
const CategoryForm = ({ open, category, onClose, fetchCategories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [topCategories, setTopCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        // 카테고리가 존재하는 경우: 수정
        if (category) {
            setName(category.name);
            setDescription(category.description);
            setParentCategory(category.parentCategory ? category.parentCategory.categoryId : '');
            return;
        }
        // 카테고리가 없는 경우: 초기화
        setName('');
        setDescription('');
        setParentCategory(null);

    }, [category, open]);

    const fetchTopCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/categories`);
            setTopCategories(response.data);
        } catch (error) {
            console.error('Error fetching top categories:', error);
        }
    };

    useEffect(() => {
        // 대분류 카테고리 가져오기
        fetchTopCategories();
    }, []);

    // 수정 또는 생성 버튼 눌렀을 때 동작
    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('카테고리명은 필수 입력 항목입니다.');
            return;  // 요청을 보내지 않음
        }

        try {
            // CategoryCreateDto랑 동일
            const categoryData = { name, description, parentCategory };

            // 카테고리 여부에 따라 Url 설정
            const url = category
                ? `${apiUrl}/api/admin/categories/${category.categoryId}` // 수정 url
                : `${apiUrl}/api/admin/categories`;  // 추가 url

            // 메서드 결정
            const method = category ? 'put' : 'post';

            // API 요청
            await axios({
                method: method,
                url: url,
                data: categoryData,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true  // 쿠키에 저장된 JWT를 자동으로 전송
            });

            // 창을 닫고 카테고리 목록 새로고침하는 콜백 함수 호출
            onClose();
            fetchCategories();  // 카테고리 목록 새로고침
            fetchTopCategories();

        } catch (error) {
            // 409 Conflict 에러 처리
            if (error.response && error.response.status === 409) {
                setError('이미 존재하는 카테고리명입니다.');
            } else {
                // 기타 에러 처리
                setError(category ? '카테고리 수정 중 오류가 발생했습니다.' : '카테고리 추가 중 오류가 발생했습니다.');
            }
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
                        required
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
                            variant={'outlined'}>
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
