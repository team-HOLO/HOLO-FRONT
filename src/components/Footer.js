import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                zIndex: 1300, // z-index 값을 높게 설정하여 사이드바 위에 표시
                position: 'fixed', // 위치를 상대적으로 설정
                bottom: 0,
                left:0,
                width: '100%'
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'© '}
                    {new Date().getFullYear()} Elice Inc. and Team HOLO.  All rights reserved.
                    <Link to="/about" style={{ marginLeft: '20px', textDecoration: 'none', color: 'inherit' }}>
                        About →
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
