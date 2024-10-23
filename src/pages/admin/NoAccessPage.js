import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block'; // BlockIcon 사용
import { useNavigate } from 'react-router-dom';

const NoAccessPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // 홈 페이지로 이동
    };

    return (
        <Container
            maxWidth="sm"
            style={{
                textAlign: 'center',
                padding: '2rem',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box mb={3}>
                <BlockIcon style={{ fontSize: 80, color: '#555' }} />
            </Box>
            <Typography variant="h4" gutterBottom>
                접근 권한이 없습니다.
            </Typography>
            <Typography variant="body1" color="textSecondary">
                관리자만 접근 가능한 페이지 입니다.
            </Typography>
            <Box mt={3}>
                <Typography
                    variant="h6"
                    color="primary"
                    onClick={handleGoHome}
                    style={{ marginTop: '20px', cursor: 'pointer' }}
                >
                    홈으로 가기 →
                </Typography>
            </Box>
        </Container>
    );
};

export default NoAccessPage;
