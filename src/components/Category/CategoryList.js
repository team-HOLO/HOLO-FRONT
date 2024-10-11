import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CategoryItem from './CategoryItem';

const CategoryList = ({ categories, onEdit, onDelete }) => {

    
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>분류 코드</TableCell>
          <TableCell>상위 코드</TableCell>
          <TableCell>카테고리명</TableCell>
          <TableCell>카테고리 설명</TableCell>
          <TableCell>관리</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categories.map((category) => (
          <CategoryItem
            key={category.categoryId}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryList;