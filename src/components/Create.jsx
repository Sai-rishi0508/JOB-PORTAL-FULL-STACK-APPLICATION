
import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const skills = ["JavaScript", "Java", "Python", "Django", "Rust",
  "Spring Boot", "React", "MySQL", "PostgreSQL", "Git"];

const initial = {
  postId: "",
  postProfile: "",
  requiredExperience: 0,
  postTechStack: [],
  postDescription: "",
};

const Create = () => {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    setMessage("");

    try {
      const payload = {
        ...form,
        postId: Number(form.postId),
        requiredExperience: Number(form.requiredExperience),
      };

      await axios.post("http://localhost:8080/JobPost", payload);
      setMessage("Job post created successfully!");

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      console.error("Error creating job:", err);
      setError("Could not create the job post. Check the backend endpoint.");
    }
  };

  return (
    <Paper elevation={0} sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add a New Job
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth required type="number" label="Post ID"
          name="postId" value={form.postId} onChange={handleChange}
          sx={{ mb: 2 }} inputProps={{ min: 1 }}
        />

        <TextField
          fullWidth required label="Job Profile"
          name="postProfile" value={form.postProfile}
          onChange={handleChange} sx={{ mb: 2 }}
        />

        <TextField
          fullWidth required type="number" label="Years of Experience"
          name="requiredExperience" value={form.requiredExperience}
          onChange={handleChange} sx={{ mb: 2 }}
          inputProps={{ min: 0 }}
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
                  checked={form.postTechStack.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                />
              }
              label={skill}
            />
          ))}
        </FormGroup>

        <Button fullWidth variant="contained" type="submit">
          Submit Job
        </Button>
      </Box>
    </Paper>
  );
};

export default Create;
