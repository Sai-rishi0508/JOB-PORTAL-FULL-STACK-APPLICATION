
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from "@mui/material";

const API_URL = "http://localhost:8080";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formError, setFormError] = useState("");

  // Fetch all jobs
  const fetchPosts = async () => {
    try {
      setError("");
      const response = await axios.get(`${API_URL}/JobPosts`);
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Unable to load jobs. Check your Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Open the edit popup
  const handleEdit = (post) => {
    setEditingPost({
      ...post,
      postTechStack: Array.isArray(post.postTechStack)
        ? post.postTechStack.join(", ")
        : "",
    });
    setFormError("");
    setEditOpen(true);
  };

  // Update form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditingPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited job
  const handleSave = async () => {
    if (!editingPost) return;

    if (!editingPost.postProfile.trim()) {
      setFormError("Job title is required.");
      return;
    }

    if (!editingPost.postDescription.trim()) {
      setFormError("Job description is required.");
      return;
    }

    const updatedPost = {
      ...editingPost,
      postTechStack: editingPost.postTechStack
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      requiredExperience: Number(editingPost.requiredExperience),
    };

    try {
      setSaving(true);
      setFormError("");

      const response = await axios.put(
        `${API_URL}/JobPost/${editingPost.postId}`,
        updatedPost
      );

      // Update the card using the server response
      const savedPost =
        response.data && typeof response.data === "object"
          ? response.data
          : updatedPost;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === editingPost.postId ? savedPost : post
        )
      );

      setEditOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error("Error updating job:", err);
      setFormError(
        err.response?.data?.message ||
          "Unable to update job. Check your backend PUT endpoint."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete job
  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/JobPost/${postId}`);

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.postId !== postId)
      );
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Check your backend DELETE endpoint.");
    }
  };

  // Search jobs
  const filteredPosts = posts.filter((p) => {
    const query = searchText.toLowerCase().trim();

    return (
      p.postProfile?.toLowerCase().includes(query) ||
      p.postDescription?.toLowerCase().includes(query) ||
      (Array.isArray(p.postTechStack) &&
        p.postTechStack.some((skill) =>
          skill.toLowerCase().includes(query)
        ))
    );
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Find Your Next Opportunity
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Explore jobs and discover opportunities that match your skills.
      </Typography>

      <TextField
        fullWidth
        label="Search Jobs"
        placeholder="Search by job title, description, or skills..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 4, backgroundColor: "white" }}
      />

      {loading && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchPosts} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredPosts.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.postId}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  boxSizing: "border-box",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.2s",
                  "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {p.postProfile}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {p.postDescription}
                </Typography>

                <Typography fontWeight={600} sx={{ mb: 2 }}>
                  Experience: {p.requiredExperience} years
                </Typography>

                <Typography fontWeight={700}>Skills</Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                    mb: 3,
                  }}
                >
                  {(p.postTechStack || []).map((skill, index) => (
                    <Chip
                      key={`${p.postId}-${skill}-${index}`}
                      label={skill}
                      sx={{
                        backgroundColor: "#dbeafe",
                        color: "#1d4ed8",
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(p.postId)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}

          {filteredPosts.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center">
                {searchText
                  ? "No matching jobs found."
                  : "No job posts available."}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Edit Job Popup */}
      <Dialog
        open={editOpen}
        onClose={() => {
          if (!saving) setEditOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Job Details</DialogTitle>

        {editingPost && (
          <>
            <DialogContent>
              {formError && (
                <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                  {formError}
                </Alert>
              )}

              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="postProfile"
                  value={editingPost.postProfile ?? ""}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Job Description"
                  name="postDescription"
                  value={editingPost.postDescription ?? ""}
                  onChange={handleChange}
                  multiline
                  minRows={3}
                  required
                />

                <TextField
                  fullWidth
                  label="Required Experience (years)"
                  name="requiredExperience"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={editingPost.requiredExperience ?? 0}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  label="Tech Stack"
                  name="postTechStack"
                  value={editingPost.postTechStack}
                  onChange={handleChange}
                  helperText="Separate skills with commas, e.g. Java, Spring Boot, React"
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={() => setEditOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Search;
