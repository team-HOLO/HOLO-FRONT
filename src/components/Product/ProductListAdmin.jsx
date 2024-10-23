import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ProductItem from './ProductIem';

const ProductList = ({ products, onEdit, onDelete }) => {

    
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>분류 코드</TableCell>
          <TableCell>상품명</TableCell>
          <TableCell>상품 설명</TableCell>
          <TableCell>관리</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <ProductItem
            key={product.productId}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductList;