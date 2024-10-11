import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Header from './components/Header';
import Home from './components/Home';
import AdminPage from "./pages/admin/AdminPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import Footer from "./components/Footer";
import About from "./pages/About";
import AdminDashboard from "./pages/admin/AdminDashboard";  // Home 컴포넌트 import

const theme = createTheme({
    palette: {
        primary: {
            main: '#424242', // 무채색(회색) 계열 색상
            contrastText: '#ffffff', // 텍스트 색상
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Header isAdmin={true}/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/admin" element={<AdminPage/>}>
                        <Route index element={<AdminDashboard />} /> {/* 기본 경로에 대해 AdminDashboard 렌더링 */}
                        <Route path="categories" element={<CategoryManagementPage/>}/>
                        <Route path="members" element={<Home/>}/>
                        <Route path="orders" element={<Home/>}/>
                        <Route path="products" element={<Home/>}/>
                    </Route>
                    <Route path="/about" element={<About/>}/>
                </Routes>
                <Footer/>
            </Router>
        </ThemeProvider>
    );
}

export default App;
