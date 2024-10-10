import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Home from './components/Home';  // Home 컴포넌트 import

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
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
