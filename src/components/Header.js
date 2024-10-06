import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryMenu from './CategoryMenu';

const Header = ({ userRole }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategoryClick = (event, category) => {
        setSelectedCategory(category);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // 카테고리 목록
    const categories = ['가구', '가전', '소품'];

    // 관리자는 관리 탭을 추가
    if (userRole === 'admin') {
        categories.push('관리');
    }

    return (
        <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
            <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                {/* 로고 */}
                <div style={{flexGrow: 1, display: 'flex', justifyContent: 'flex-start'}}>
                    <Typography variant="h6" component="div">
                        <img src="../logo.svg" alt="logo" style={{height: '40px'}}/>
                    </Typography>
                </div>


                {/* 중앙 정렬된 카테고리 */}
                <div style={{flexGrow: 2, display: 'flex', justifyContent: 'center'}}>
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={(e) => handleCategoryClick(e, category)}
                            style={{marginRight: '20px'}}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <CategoryMenu
                    category={selectedCategory}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                />

                {/* 우측 메뉴 아이템 */}
                <div style={{flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <IconButton color="inherit">
                        <ShoppingCartIcon/>
                    </IconButton>

                    {userRole === 'admin' ? (
                        <Button variant="contained" style={{marginLeft: '10px'}}>
                            Admin
                        </Button>
                    ) : (
                        <div>
                            <Button variant="outlined" style={{marginLeft: '10px'}}>
                                MyPage
                            </Button>
                            <Button variant="contained" style={{marginLeft: '10px'}}>
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
