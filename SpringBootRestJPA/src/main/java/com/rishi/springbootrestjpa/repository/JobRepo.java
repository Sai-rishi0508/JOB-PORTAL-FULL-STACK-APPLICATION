package com.rishi.springbootrestjpa.repository;

import com.rishi.springbootrestjpa.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface JobRepo extends JpaRepository<JobPost,Integer>{
    List<JobPost> findByPostProfileContainingOrPostDescriptionContaining(String postProfile, String postDescription);

}
