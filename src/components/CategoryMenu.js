import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Box, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function CategoryMenu({ categories, refreshCategories }) {
    const [activeMenu, setActiveMenu] = useState(null)
    const navigate = useNavigate(); // useNavigate를 사용

    const handleMouseEnter = (event, categoryId) => {
        setActiveMenu(categoryId);
    };

    const handleClose = () => {
        setActiveMenu(null);
    };

    const handleMenuItemClick = (event, categoryId) => {
        refreshCategories();
        navigate(`/products/category/${categoryId}`);
        handleClose();
    };

    return (
        <Box style={{ display: 'flex' }}>
            {categories.map((category, index) => (
                <Box
                    className={`category${index}`}
                    key={category.categoryId}
                    onMouseEnter={(event) => handleMouseEnter(event, category.categoryId)}
                    style={{ position: 'relative',padding: '20px', cursor: 'pointer' }}
                    onMouseLeave={handleClose}
                    onClick={(event) => handleMenuItemClick(event, category.categoryId)}
                >
                    {category.name}
                    {activeMenu === category.categoryId && <Box
                        style={{
                            position: "absolute",
                            top: '60.5px',
                            left: 0,
                            width: "100%",
                            backgroundColor: 'white',
                            color: 'rgba(0, 0, 0, 0.87)',
                            boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
                            padding: "2px 0px",
                            borderRadius: '4px',
                            minWidth: '200px',
                            maxWidth: '350px',
                            wordBreak: 'break-all', // 긴 단어도 줄바꿈 가능
                            whiteSpace: 'normal',   // 줄바꿈 허용
                        }}
                    >
                        {category.subCategories.map(subCategory => (
                            <MenuItem
                                key={subCategory.categoryId}
                                style={{
                                    width: "100%",
                                    wordBreak: 'break-all', // 긴 단어도 줄바꿈 가능
                                    whiteSpace: 'normal',   // 줄바꿈 허용
                                }}>
                                {subCategory.name}
                            </MenuItem>
                        ))}
                    </Box>}
                </Box>
            ))}
        </Box>

    );
}

export default CategoryMenu;
