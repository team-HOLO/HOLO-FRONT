import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryItem = ({ category, onEdit, onDelete }) => {
  const formattedCategoryId = String(category.categoryId).padStart(4, '0');

  return (
    <TableRow>
      <TableCell>{formattedCategoryId}</TableCell>
      <TableCell>{category.parentId ? String(category.parentId).padStart(4, '0') : '-'}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.description}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(category)} aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(category)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CategoryItem;