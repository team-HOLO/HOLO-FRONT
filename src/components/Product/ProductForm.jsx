import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const filePath = 'https://holo-bucket.s3.ap-northeast-2.amazonaws.com/'

const ProductForm = ({ open, product, onClose }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        stockQuantity: '',
        productOptions: [{ color: '', size: '' }],
        images: [],
        files: [],
        thumbnails: [], // 썸네일로 선택된 이미지의 인덱스 배열
        categoryId: '',
    });
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [stockQuantityError, setStockQuantityError] = useState('');
    const [imageError, setImageError] = useState('');
    const [thumbnailImageError, setThumbnailImageError] = useState('');

    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [optionError, setOptionError] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {

        axios.get(`${apiUrl}/api/categories/all`)
            .then(response => {
                // 모든 하위 카테고리를 추출하여 상태로 저장
                const allSubCategories = response.data.flatMap(category => category.subCategories);
                setSubCategories(allSubCategories);
            })
            .catch(error => {
                console.error('fail to get category', error);
            });

        // 제품이 존재하는 경우: 수정
        if (product) {
            const imageUrls = product.productImageDtos.map(image => `${filePath}${image.storeName}`)
            setNewProduct({
                name: product.name,
                price: product.price,
                description: product.description,
                stockQuantity: product.stockQuantity,
                productOptions: product.productOptions || [{ color: '', size: '' }],
                images: imageUrls || [], // storeName으로 설정
                // files: product.files || [],
                thumbnails: product.isThumbnails || [],
                categoryId: product.categoryId,
            });

            setSelectedSubCategory(product.categoryId); // 서버에서 받아온 카테고리 ID로 설정
        }
        // 제품이 존재하지 않는 경우: 새로 생성
        else {
            setNewProduct({
                name: '',
                price: '',
                description: '',
                stockQuantity: '',
                productOptions: [{ color: '', size: '' }],
                images: [],
                files: [],
                thumbnails: [],
                categoryId: '',
            });
            setSelectedSubCategory(''); // 새로운 상품 추가 시 하위 카테고리 초기화
        }
    }, [product]);

    // 하위 카테고리 변경 핸들러
    const handleSubCategoryChange = (event) => {
        const selectedCategoryId = event.target.value;
        setSelectedSubCategory(selectedCategoryId);
        handleChange({
            target: {
                name: 'categoryId',
                value: selectedCategoryId
            }
        });
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));

        // 에러 초기화
        if (name === 'name') setNameError('');
        if (name === 'price') setPriceError('');
        if (name === 'description') setDescriptionError('');
        if (name === 'stockQuantity') setStockQuantityError('');
    };

    const handleOptionChange = (index, e) => {
        const { name, value } = e.target;
        const newOptions = [...newProduct.productOptions];
        newOptions[index][name] = value;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            productOptions: newOptions,
        }));
    };

    const addOption = () => {
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            productOptions: [...prevProduct.productOptions, { color: '', size: '' }],
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
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            images: imageUrls, // 미리보기용 URL
            files: files,
        }));

        setImageError(''); // 에러 초기화
    };

    const toggleThumbnail = (index) => {
        setNewProduct((prevProduct) => {
            const newThumbnails = [...prevProduct.thumbnails];
            if (newThumbnails.includes(index)) {
                newThumbnails.splice(newThumbnails.indexOf(index), 1); // 선택 해제
            } else {
                newThumbnails.push(index); // 선택
            }

            const errorMessage = newThumbnails.length === 0 ? '최소 하나의 썸네일을 선택해야 합니다.' : '';
            setThumbnailImageError(errorMessage);

            return {
                ...prevProduct,
                thumbnails: newThumbnails,
            };


        });
    };

    const handleOptionDelete = (index) => {
        setNewProduct((prevProduct) => {
            const updatedOptions = prevProduct.productOptions.filter((_, i) => i !== index);
            return {
                ...prevProduct,
                productOptions: updatedOptions,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        if (!newProduct.name) {
            setNameError('상품명은 필수입니다.');
            hasError = true;
        }
        if (!newProduct.price) {
            setPriceError('가격은 필수입니다.');
            hasError = true;
        }
        if (!newProduct.description) {
            setDescriptionError('상품 설명은 필수입니다.');
            hasError = true;
        }
        if (!newProduct.stockQuantity) {
            setStockQuantityError('재고 수량은 필수입니다.');
            hasError = true;
        }
        if (newProduct.images.length === 0) {
            setImageError('이미지 업로드는 필수입니다.');
            hasError = true;
        }
        if (newProduct.thumbnails.length === 0) {
            setThumbnailImageError('최소 하나의 썸네일을 선택해야합니다.');
            hasError = true;
        }

        // 옵션 검증
        if (newProduct.productOptions.length === 0) {
            setOptionError('최소 하나의 옵션이 필요합니다.');
            hasError = true;
        } else {
            newProduct.productOptions.forEach((option, index) => {
                if (!option.color || !option.size) {
                    setOptionError(`옵션의 색상과 사이즈를 모두 입력해주세요.`);
                    hasError = true;
                }
            });
        }


        if (hasError) return; // 에러가 있으면 제출하지 않음

        const isThumbnailList = newProduct.images.map((_, index) => newProduct.thumbnails.includes(index));
        const formData = new FormData();
        const updateFormData = new FormData();

        if (!product) {
            //상품 추가용 form
            formData.append('addProductRequest', new Blob([JSON.stringify({
                name: newProduct.name,
                price: parseInt(newProduct.price, 10),
                description: newProduct.description,
                stockQuantity: parseInt(newProduct.stockQuantity, 10),
                productOptions: newProduct.productOptions,
                isThumbnails: isThumbnailList,
                categoryId: newProduct.categoryId, // 선택된 카테고리 ID 추가
            })], { type: 'application/json' }));

            newProduct.images.forEach((image, index) => {
                const file = newProduct.files[index];
                if (file) {
                    formData.append('productImages', file); // 'productImages'는 서버에서 받을 필드 이름
                }
            });

        } else {
            //상품 수정용 form
            updateFormData.append('updateProductRequest', new Blob([JSON.stringify({
                name: newProduct.name,
                price: parseInt(newProduct.price, 10),
                description: newProduct.description,
                stockQuantity: parseInt(newProduct.stockQuantity, 10),
                productOptions: newProduct.productOptions,
                isThumbnails: isThumbnailList,
                categoryId: newProduct.categoryId,
            })], { type: 'application/json' }));

        }

        try {
            if (!product) {
                const response = await axios.post(
                    `${apiUrl}/api/admin/products`,
                    formData,
                    {
                        withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
                    }
                );

                // 응답 처리
                if (response.status === 201) {
                    alert('상품 등록 성공'); // 상품 생성 성공 알림
                    onClose(); // 창 닫기
                } else {
                    setError('상품 등록 실패');
                }
            } else {
                const response = await axios.put(
                    `${apiUrl}/api/admin/products/${product.productId}`,
                    updateFormData,
                    {
                        withCredentials: true,  // 쿠키에 저장된 JWT를 자동으로 전송
                    }
                );

                // 응답 처리
                if (response.status === 200) {
                    alert('상품 수정 성공'); // 상품 수정 성공 알림
                    onClose(); // 창 닫기
                } else {
                    setError('상품 수정 실패');
                }
            }
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('이미 존재하는 상품명입니다.');
            } else {
                setError('상품 추가/수정 중 오류가 발생했습니다.');
            }
        }

    };

    useEffect(() => {
        return () => {
            newProduct.images.forEach(imageUrl => {
                URL.revokeObjectURL(imageUrl);
            });
        };
    }, [newProduct.images]);

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
                        error={!!nameError || !!error} // 두 가지 에러 상태를 모두 확인
                        helperText={nameError || error} // 한쪽 에러 메시지를 표시
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
                        error={!!priceError}
                        helperText={priceError}
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
                        error={!!descriptionError}
                        helperText={descriptionError}
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
                        error={!!stockQuantityError}
                        helperText={stockQuantityError}
                        required
                    />

                    {/* 하위 카테고리 선택 */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="sub-category-label">카테고리</InputLabel>
                        <Select
                            labelId="sub-category-label"
                            value={selectedSubCategory} // 선택된 카테고리 ID
                            onChange={handleSubCategoryChange}
                            name="subCategory"
                            required
                        >
                            {subCategories.map((subCategory) => (
                                <MenuItem key={subCategory.categoryId} value={subCategory.categoryId}> {/* categoryId를 value로 설정 */}
                                    {subCategory.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 옵션 목록 표시 */}
                    {newProduct.productOptions.map((option, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="medium"
                                onClick={() => handleOptionDelete(index)}
                                style={{ marginLeft: '10px' }}
                            >
                                <Typography variant="body2" style={{ fontSize: '0.75rem' }}>
                                    삭제
                                </Typography>
                            </Button>
                        </div>
                    ))}
                    {/* 옵션 에러 메시지 표시 */}
                    {optionError && <Typography color="error" variant="caption">{optionError}</Typography>}

                    {/* 옵션 추가 버튼을 아래에 하나만 배치 */}
                    <Button variant="contained" onClick={addOption} style={{ marginTop: '10px' }}>
                        옵션 추가
                    </Button>

                    <h3>상품 이미지</h3>
                    {!product && (  // product가 없을 때만 렌더링
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    )}
                    {imageError && <div style={{ color: 'red' }}>{imageError}</div>}
                    <h3>이미지 미리보기</h3>
                    {thumbnailImageError && <div style={{ color: 'red' }}>{thumbnailImageError}</div>}
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
};

export default ProductForm;