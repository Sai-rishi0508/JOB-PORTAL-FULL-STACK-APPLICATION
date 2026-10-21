
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Allposts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/jobPosts");
      setPosts(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load job posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:8080/jobPost/${id}`);
      setPosts((prev) => prev.filter((p) => p.postId !== id));
    } catch (err) {
      console.error(err);
      setError("Unable to delete the job post.");
    }
  };

  if (loading) {
    return <Box sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Manage Job Posts
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {posts.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.postId}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h5" fontWeight={700}>
                {p.postProfile}
              </Typography>

              <Typography sx={{ my: 2 }}>
                {p.postDescription}
              </Typography>

              <Typography>
                Experience: {p.requiredExperience} years
              </Typography>

              <Typography fontWeight={700} sx={{ mt: 2 }}>
                Skills: {(p.postTechStack || []).join(", ")}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <IconButton
                  color="primary"
                  aria-label="Edit job"
                  onClick={() => navigate("/edit", { state: { id: p.postId } })}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  aria-label="Delete job"
                  onClick={() => handleDelete(p.postId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}

        {posts.length === 0 && !error && (
          <Grid item xs={12}>
            <Typography align="center">No job posts available.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Allposts;
