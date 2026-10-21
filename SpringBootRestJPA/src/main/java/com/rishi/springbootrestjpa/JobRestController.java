package com.rishi.springbootrestjpa;

import com.rishi.springbootrestjpa.model.JobPost;
import com.rishi.springbootrestjpa.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins ="http://localhost:3000")
public class JobRestController {
    @Autowired
    private JobService service;
    @GetMapping("JobPosts")
    public List<JobPost> getAlljobs(){
        return service.getAllJobs();
    }
    @GetMapping("JobPost/{postId}")
    public JobPost getJob(@PathVariable("postId") int postId){
        return service.getJob(postId);
    }
    @GetMapping("JobPosts/keyword/{keyword}")
    public List<JobPost> searchByKeyword(@PathVariable("keyword") String keyword){
       return service.search(keyword);
    }

    @PostMapping("/JobPost")
    public JobPost addJob(@RequestBody JobPost jobPost){
        service.addJob(jobPost);
        return service.getJob(jobPost.getPostId());
    }
    @PostMapping("/test")
    public String test() {
        return "POST endpoint is working";
    }
    @PutMapping("JobPost/{postId}")
    public JobPost updateJob(@RequestBody JobPost jobPost){
        service.updateJob(jobPost);
        return service.getJob(jobPost.getPostId());
    }
    @DeleteMapping("JobPost/{postId}")
    public String deleteJob(@PathVariable int postId){
        service.deleteJob(postId);
        return "Deleted";
    }
    @GetMapping("load")
    public String loadData(){
        service.load();
        return "success";
    }
}
