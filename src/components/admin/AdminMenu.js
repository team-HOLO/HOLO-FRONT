import React from 'react';
import {Box, Card, CardContent, Typography} from '@mui/material';

const AdminMenu = ({ image, title, desc }) => {
    return (
        <Card>
            <CardContent>
                <Box
                    component="img"
                    src={image}
                    alt={title}
                    sx={{
                        width: '100%', // 이미지의 크기를 조정
                        height: 'auto', // 이미지 비율을 유지
                        borderRadius: '8px', // 원하는 스타일 추가
                    }}
                    style={{
                        backgroundColor: 'lightgrey'
                    }}
                />
                <Box style = {{padding: '20px 0'}}>
                    <Typography variant="h5" style={{padding: '5px 0'}}>{title}</Typography>
                    <Typography>{desc}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AdminMenu;
