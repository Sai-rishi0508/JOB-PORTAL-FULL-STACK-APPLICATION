
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#172554" }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Job Portal
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button component={Link} to="/" sx={{ color: "white" }}>
            Home
          </Button>

          <Button component={Link} to="/create" sx={{ color: "white" }}>
            Add Jobs
          </Button>

          <Button component={Link} to="/contact" sx={{ color: "white" }}>
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
