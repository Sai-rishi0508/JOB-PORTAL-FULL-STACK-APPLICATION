
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const skills = ["JavaScript", "Java", "Python", "Django", "Rust",
  "Spring Boot", "React", "MySQL", "PostgreSQL", "Git"];

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id == null) {
      setError("No job was selected to edit.");
      return;
    }

    axios
      .get(`http://localhost:8080/jobPost/${id}`)
      .then((response) => setForm(response.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load this job post.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skill) => {
    setForm((prev) => ({
      ...prev,
      postTechStack: prev.postTechStack.includes(skill)
        ? prev.postTechStack.filter((s) => s !== skill)
        : [...prev.postTechStack, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...form,
        postId: Number(form.postId),
        requiredExperience: Number(form.requiredExperience),
      };

      await axios.post("http://localhost:8080/jobPost", payload);
      navigate("/allposts");
    } catch (err) {
      console.error(err);
      setError("Unable to save changes. Check your backend endpoint.");
    }
  };

  if (error && !form) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  if (!form) {
    return <Box sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Paper elevation={0} sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Job Post
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth required type="number" label="Post ID"
          name="postId" value={form.postId} onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth required label="Job Profile"
          name="postProfile" value={form.postProfile} onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth required type="number" label="Years of Experience"
          name="requiredExperience" value={form.requiredExperience}
          onChange={handleChange} sx={{ mb: 2 }}
        />

        <TextField
          fullWidth required multiline rows={4} label="Job Description"
          name="postDescription" value={form.postDescription}
          onChange={handleChange} sx={{ mb: 2 }}
        />

        <Typography variant="h6">Required Skills</Typography>

        <FormGroup sx={{ mb: 3 }}>
          {skills.map((skill) => (
            <FormControlLabel
              key={skill}
              control={
                <Checkbox
                  checked={(form.postTechStack || []).includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                />
              }
              label={skill}
            />
          ))}
        </FormGroup>

        <Button fullWidth variant="contained" type="submit">
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default Edit;
