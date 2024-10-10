import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Box, Menu, MenuItem} from '@mui/material';

function CategoryMenu() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        // 대분류 카테고리 가져오기
        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error('Error fetching top-level categories:', error));
    }, []);

    const handleMouseEnter = (event, categoryId) => {
        setAnchorEl(event.currentTarget);
        // 대분류 데이터에서 소분류 찾기
        const selectedCategory = categories.find(category => category.categoryId === categoryId);
        if (selectedCategory) {
            setSubCategories(selectedCategory.subCategories);
        } else {
            setSubCategories([]);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event, categoryId) => {
        handleClose();
    };

    return (
        <Box style={{ display: 'flex' }}>
            {categories.map(category => (
                <Box
                    key={category.categoryId}
                    onMouseEnter={(event) => handleMouseEnter(event, category.categoryId)}
                    style={{ margin: '20px', cursor: 'pointer' }}
/*
                    onMouseLeave={handleClose}
*/
                    onClick={(event) => handleMenuItemClick(event, category.categoryId)}
                >
                    {category.name}
                </Box>
            ))}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    onMouseLeave: handleClose,  // 마우스가 메뉴를 벗어날 때 닫기
                }}
            >
                {subCategories.map(subCategory => (
                    <MenuItem key={subCategory.categoryId} onClick={handleClose}>
                        {subCategory.name}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}

export default CategoryMenu;
