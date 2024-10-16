import React, {useEffect} from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryMenu from 'components/CategoryMenu';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LoginIcon from '@mui/icons-material/Login';

function Header({ isAdmin, categories, refreshCategories }) {
    useEffect(() => {
        refreshCategories();
    }, [refreshCategories]);  // categories가 변경되면 refreshCategories가 실행

    return (
        <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        HOLO
                    </Link>
                </Typography>
                <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <CategoryMenu categories={categories} refreshCategories={refreshCategories} />
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
                <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <AddShoppingCartIcon style={{ padding: '0 10px' }}/>
                    <LoginIcon style={{ padding: '0 10px' }}/>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
