import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Toolbar,
  Drawer,
} from "@mui/material";

const AdminPage = () => {
  const location = useLocation();
  const isRootAdminPath = location.pathname === "/admin";

  return (
    <Box display="flex" height="100vh">
      {!isRootAdminPath && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/orders">
                  <ListItemText primary="주문 관리" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/products">
                  <ListItemText primary="상품 관리" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin/categories">
                  <ListItemText primary="카테고리 관리" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}
      <Box flexGrow={1} p={3} bgcolor="white">
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminPage;
