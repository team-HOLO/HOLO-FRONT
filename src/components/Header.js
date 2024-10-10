import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';  // React Router의 Link 컴포넌트 사용
import CategoryMenu from './CategoryMenu';

function Header({ isAdmin }) {

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        HOLO
                    </Link>
                </Typography>
                <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <CategoryMenu />
                </Box>
                <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {isAdmin && (  // isAdmin이 true일 때만 렌더링
                        <Typography style={{ flexGrow: 1 }}>
                            <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                                관리
                            </Link>
                        </Typography>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;