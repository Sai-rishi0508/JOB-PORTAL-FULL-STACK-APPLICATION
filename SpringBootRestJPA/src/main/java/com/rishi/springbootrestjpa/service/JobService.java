package com.rishi.springbootrestjpa.service;

import com.rishi.springbootrestjpa.model.JobPost;
import com.rishi.springbootrestjpa.repository.JobRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class JobService {
    @Autowired
    private JobRepo repository;
    public void addJob(JobPost jobPost){
       repository.save(jobPost);
    }

    public List<JobPost> getAllJobs(){
        return repository.findAll();
    }

    public JobPost getJob(int postId) {
        return repository.findById(postId).orElse(new JobPost());
    }

    public void updateJob(JobPost jobPost) {
        repository.save(jobPost);
    }

    public void deleteJob(int postId) {
        repository.deleteById(postId);
    }

    public void load() {
        List<JobPost> jobs = new ArrayList<>(Arrays.asList(
                new JobPost(1, "Java Developer", "Develop and maintain Java-based applications.", 2, Arrays.asList("Java", "Spring Boot", "MySQL", "Git")),
                new JobPost(2, "Frontend Developer", "Build responsive and user-friendly web applications.", 1, Arrays.asList("HTML", "CSS", "JavaScript", "React")),
                new JobPost(3, "Backend Developer", "Design and develop scalable backend services and APIs.", 3, Arrays.asList("Java", "Spring", "REST API", "PostgreSQL")),
                new JobPost(4, "Full Stack Developer", "Work on both frontend and backend development.", 2, Arrays.asList("Java", "Spring Boot", "React", "MongoDB")),
                new JobPost(5, "Python Developer", "Develop Python applications and data processing solutions.", 1, Arrays.asList("Python", "Django", "SQL", "Git"))));

        repository.saveAll(jobs);

    }

    public List<JobPost> search(String keyword) {
       return repository.findByPostProfileContainingOrPostDescriptionContaining(keyword,keyword);
    }
}
