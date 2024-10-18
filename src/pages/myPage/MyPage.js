import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Box, Tabs, Tab } from '@mui/material';
import MyInfo from 'pages/myPage/MyInfo'; // 나의 정보 관리 컴포넌트
import MyOrderPage from 'pages/myPage/MyOrderPage'; // 나의 주문 목록

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MyPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <h1>마이 페이지</h1>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="회원 정보 수정" {...a11yProps(0)} />
            <Tab label="나의 주문 목록" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <MyInfo /> {/* 나의 정보 관리 컴포넌트 */}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MyOrderPage /> {/* 나의 주문 목록 컴포넌트 */}
        </CustomTabPanel>
      </Box>
    </Container>
  );
};

export default MyPage;
