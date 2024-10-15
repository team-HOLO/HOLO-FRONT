import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Header from './components/Header';
import Home from './components/Home';
import AdminPage from "./pages/admin/AdminPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import Footer from "./components/Footer";
import About from "./pages/About";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Main from "./pages/Main";
import ProductManagementPage from './pages/admin/ProductManagementPage'

const theme = createTheme({
    palette: {
        primary: {
            main: '#424242',
            contrastText: '#ffffff',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header isAdmin={true}/>
                    <div style={{ flex: 1, paddingBottom: '60px' }}> {/* Footer 높이만큼 여백 추가 */}
                        <Routes>
                            <Route path="/" element={<Main/>}/>
                            <Route path="/admin" element={<AdminPage/>}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="categories" element={<CategoryManagementPage/>}/>
                                <Route path="members" element={<Home/>}/>
                                <Route path="orders" element={<Home/>}/>
                                <Route path="products" element={<ProductManagementPage/>}/>
                            </Route>
                            <Route path="/about" element={<About/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
