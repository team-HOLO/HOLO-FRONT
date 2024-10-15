import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const ProductForm = ({open, product, onClose}) => {
    const [newProduct, setProductt] = useState({
        name: '',
        price: '',
        description: '',
        stockQuantity: '',
        productOptions: [{ color: '', size: '' }],
        images: [],
        files: [],
        thumbnails: [], // 썸네일로 선택된 이미지의 인덱스 배열
    });

    useEffect(() => {
        // 제품이 존재하는 경우: 수정
        if (product) {
            setProductt({
                name: product.name,
                price: product.price,
                description: product.description,
                stockQuantity: product.stockQuantity,
                productOptions: product.productOptions || [{ color: '', size: '' }],
                images: product.productImageDtos || [],
                // files: product.files || [],
                thumbnails: product.isThumbnails || [],
            });
            console.log('dsafjlkadsjfkladsfj'+product.images);
        }
        // 제품이 존재하지 않는 경우: 새로 생성
        else {
            setProductt({
                name: '',
                price: '',
                description: '',
                stockQuantity: '',
                productOptions: [{ color: '', size: '' }],
                images: [],
                files: [],
                thumbnails: [],
            });
        }
    }, [product]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductt((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleOptionChange = (index, e) => {
        const { name, value } = e.target;
        const newOptions = [...newProduct.productOptions];
        newOptions[index][name] = value;
        setProductt((prevProduct) => ({
            ...prevProduct,
            productOptions: newOptions,
        }));
    };

    const addOption = () => {
        setProductt((prevProduct) => ({
            ...prevProduct,
            productOptions: [...prevProduct.productOptions, { color: '', size: ''}],
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));  // 이미지 미리보기를 위해 생성
    
        // 실제 파일을 FormData에 추가
        const formData = new FormData();
        files.forEach(file => {
            formData.append('productImages', file); // 'productImages'는 서버에서 받을 필드 이름
        });
    
        // 상태 업데이트
        setProductt((prevProduct) => ({
            ...prevProduct,
            images: imageUrls, // 미리보기용 URL
            files: files,
        }));
    };

    const toggleThumbnail = (index) => {
        setProductt((prevProduct) => {
            const newThumbnails = [...prevProduct.thumbnails];
            if (newThumbnails.includes(index)) {
                newThumbnails.splice(newThumbnails.indexOf(index), 1); // 선택 해제
            } else {
                newThumbnails.push(index); // 선택
            }
            return {
                ...prevProduct,
                thumbnails: newThumbnails,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isThumbnailList = newProduct.images.map((_, index) => newProduct.thumbnails.includes(index));

        console.log('isThumbnailList:' , isThumbnailList);

        const formData = new FormData();
        formData.append('addProductRequest', new Blob([JSON.stringify({
            name: newProduct.name,
            price: parseInt(newProduct.price, 10),
            description: newProduct.description,
            stockQuantity: parseInt(newProduct.stockQuantity, 10),
            productOptions: newProduct.productOptions,
            isThumbnails: isThumbnailList,
        })], { type: 'application/json' }));

        newProduct.images.forEach((image, index) => {
        const file = newProduct.files[index]; 
        if (file) {
            console.log('Appending image:', file); // 각 파일 확인
            formData.append('productImages', file); // 'productImages'는 서버에서 받을 필드 이름
        }});

        //상품 새로 생성
        if(!product) {
            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    body: formData,
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log('상품 등록 성공:', data);
                    alert('상품 등록 성공');
                } else {
                    console.error('상품 등록 실패:', response.statusText);
                }
            } catch (error) {
                console.error('서버 오류:', error);
            }
        } else {  //카테고리 수정
            try {
                const response = await fetch(`/api/products/${product.productId}`, {
                    method: 'PUT',
                    body: formData,
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log('상품 수정 성공:', data);
                    alert('상품 수정 성공');
                } else {
                    console.error('상품 수정 실패:', response.statusText);
                }
            } catch (error) {
                console.error('서버 오류:', error);
            }
        }
        onClose();
        window.location.reload(); 
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{product ? '상품 수정' : '상품 추가'}</DialogTitle>
            <DialogContent>
                <Box component="form" mt={2}>
                    <TextField
                        fullWidth
                        label="상품명"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="가격"
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField 
                        fullWidth
                        label="상품 설명"
                        name="description"
                        multiline
                        rows={4}
                        value={newProduct.description}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField 
                        fullWidth
                        label="재고 수량"
                        type="number"
                        name="stockQuantity"
                        value={newProduct.stockQuantity}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    {newProduct.productOptions.map((option, index) => (
                        <div key={index}>
                            <TextField 
                                label="색상"
                                type="text"
                                name="color"
                                size="small"
                                value={option.color}
                                onChange={(e) => handleOptionChange(index, e)}
                                margin="normal"
                                required
                            />
                            <TextField 
                                label="사이즈"
                                type="text"
                                name="size"
                                size="small"
                                value={option.size}
                                onChange={(e) => handleOptionChange(index, e)}
                                margin="normal"
                                required
                            />
                            <Button variant="contained" onClick={addOption}>
                                옵션 추가 
                            </Button>
                        </div>
                    ))}
                    <h3>상품 이미지</h3>
                    <input 
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <h3>이미지 미리보기</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {newProduct.images.map((image, index) => (
                            <div key={index} style={{ margin: '10px' }}>
                                <img
                                    // src={product? `https://example.com/images/${image}` : image}
                                    src={image}
                                    alt={`상품 이미지 ${index + 1}`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        cursor: 'pointer',
                                        border: newProduct.thumbnails.includes(index) ? '3px solid blue' : 'none',
                                    }}
                                    onClick={() => toggleThumbnail(index)}
                                />
                            </div>
                        ))}
                    </div>
                    {newProduct.thumbnails.length > 0 && (
                        <div>
                            <h4>선택된 썸네일:</h4>
                            {newProduct.thumbnails.map((thumbIndex) => (
                                <img
                                    key={thumbIndex}
                                    src={newProduct.images[thumbIndex]}
                                    alt={`선택된 썸네일 ${thumbIndex + 1}`}
                                    style={{ width: '150px', height: '150px', margin: '5px' }}
                                />
                            ))}
                        </div>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSubmit}>
                    {product ? '수정' : '등록'}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
    

    // return (
    //     <form onSubmit={handleSubmit}>
    //         <h2>상품 등록</h2>
    //         <Box component="form" mt={2}>
    //             <TextField
    //                 // fullWidth
    //                 label="상품명"
    //                 name="name"
    //                 value={product.name}
    //                 onChange={handleChange}
    //                 margin="normal"
    //                 required
    //             />
    //             <br/>

    //             <TextField
    //                 // fullWidth
    //                 label="가격"
    //                 type="number"
    //                 name="price"
    //                 value={product.price}
    //                 onChange={handleChange}
    //                 margin="normal"
    //                 required
    //             />
    //             <br/>

    //             <TextField 
    //                 label="상품 설명"
    //                 name="description"
    //                 multiline
    //                 rows={4}
    //                 value={product.description}
    //                 onChange={handleChange}
    //                 margin="normal"
    //                 required
    //             />
    //             <br />

    //             <TextField 
    //                 label="재고 수량"
    //                 type="number"
    //                 name="stockQuantity"
    //                 value={product.stockQuantity}
    //                 onChange={handleChange}
    //                 margin="normal"
    //                 required
    //             />
    //             <br />

    //             {product.productOptions.map((option, index) => (
    //                 <div key={index}>
    //                     <TextField 
    //                         label="색상"
    //                         type="text"
    //                         name="color"
    //                         size="small"
    //                         value={option.color}
    //                         onChange={(e) => handleOptionChange(index, e)}
    //                         margin="normal"
    //                         required
    //                     />
    //                     <TextField 
    //                         label="사이즈"
    //                         type="text"
    //                         name="size"
    //                         size="small"
    //                         value={option.size}
    //                         onChange={(e) => handleOptionChange(index, e)}
    //                         margin="normal"
    //                         required
    //                     />
    //                     <br />
    //                     <Button variant="contained" onClick={addOption}>
    //                         옵션 추가 
    //                     </Button>
    //                 </div>
    //             ))}
    //             <br />
                
    //             <h3>상품 이미지</h3>
    //             <input 
    //                 type="file"
    //                 multiple
    //                 accept="image/*"
    //                 // name={`image`}
    //                 onChange={handleImageChange}
    //                 required
    //             />
    //             <br />

    //             <h3>이미지 미리보기</h3>
    //             <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    //                 {product.images.map((image, index) => (
    //                     <div key={index} style={{ margin: '10px' }}>
    //                         <img
    //                             src={image}
    //                             alt={`상품 이미지 ${index + 1}`}
    //                             style={{
    //                                 width: '100px',
    //                                 height: '100px',
    //                                 cursor: 'pointer',
    //                                 border: product.thumbnails.includes(index) ? '3px solid blue' : 'none',
    //                             }}
    //                             onClick={() => toggleThumbnail(index)}
    //                         />
    //                     </div>
    //                 ))}
    //             </div>
    //             {product.thumbnails.length > 0 && (
    //                 <div>
    //                     <h4>선택된 썸네일:</h4>
    //                     {product.thumbnails.map((thumbIndex) => (
    //                         <img
    //                             key={thumbIndex}
    //                             src={product.images[thumbIndex]}
    //                             alt={`선택된 썸네일 ${thumbIndex + 1}`}
    //                             style={{ width: '150px', height: '150px', margin: '5px' }}
    //                         />
    //                     ))}
    //                 </div>
    //             )}
    //             <Button variant="contained" onClick={handleSubmit}>
    //                 상품 등록
    //             </Button>
    //             <Button variant="outlined">
    //                 취소
    //             </Button>
    //         </Box>
    //         <br/>
    //         <br/>
    //         <br/>
    //         <br/>
    //         <br/>
    //         <br/>
    //         <br/>
        
    //     </form>
    // );
};

export default ProductForm;