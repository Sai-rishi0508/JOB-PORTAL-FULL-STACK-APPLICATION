
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Create from "./components/Create";
import Edit from "./components/Edit";
import Allposts from "./components/AllPosts";
import { Box, Typography } from "@mui/material";

const Contact = () => (
  <Box sx={{ p: 5, textAlign: "center" }}>
    <Typography variant="h4" gutterBottom>
      Contact Us
    </Typography>
    <Typography>
      Have questions about our Job Portal? Contact our support team for help.
    </Typography>
  </Box>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/allposts" element={<Allposts />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
