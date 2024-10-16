import Carousel from "react-material-ui-carousel";
import { Typography, Box, Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

function Main() {
    const carouselList = [
        {
            title: "가구",
            url: 'images/main_image1.jpg'
        },
        {
            title: "주방",
            url: 'images/main_image2.jpg'
        },
        {
            title: "소품",
            url: 'images/main_image3.jpg'
        }
    ];

    return (
        <>
            <Carousel cycleNavigation={true} navButtonsAlwaysVisible={true}>
                {carouselList.map((carousel, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                        <img
                            src={carousel.url}
                            alt={carousel.title}
                            style={{
                                height: '50vh',
                                width: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                filter: 'brightness(50%)', // 이미지 밝기 조정
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>HOLO</Typography>
                            <Typography variant="h6">Home Organization & Lifestyle Optimization</Typography>
                        </Box>
                    </Box>
                ))}
            </Carousel>
            <Box sx={{ padding: '30px 10%' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>New Arrivals</Typography> {/* 여기에 간격 추가 */}
                <Grid container spacing={2}>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={'images/main_image1.jpg'}
                                        alt="쇼파"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            쇼파
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            1인용 쇼파
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}

export default Main;
