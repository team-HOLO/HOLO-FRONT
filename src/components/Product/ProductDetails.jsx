import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = ({ match }) => {
    const [product, setProduct] = useState(null);
    const productId = useParams() // URL에서 productId 가져오기

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`api/products/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    
    // 상품 정보 렌더링
    return (
        <div>
            {product ? (
                <div>
                    <h1>{product.name}</h1>
                    <img src={`${filePath}${product.thumbNailImage[0].storeName}`} alt={product.name} />
                    <p>{product.price} 원</p>
                    {/* 추가적인 상품 정보 렌더링 */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProductDetails;