import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const CategoryMenu = ({ category, anchorEl, open, onClose }) => {
    const subCategories = {
        가구: ['침대', '소파', '테이블', '책상', '의자', '옷장'],
        가전: ['TV', '냉장고', '세탁기'],
        소품: ['액자', '꽃병', '시계']
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    width: '200px',
                },
            }}
        >
            {subCategories[category]?.map((subCategory) => (
                <MenuItem key={subCategory} onClick={onClose}>
                    {subCategory}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default CategoryMenu;
