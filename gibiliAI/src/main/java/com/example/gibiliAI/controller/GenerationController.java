package com.example.gibiliAI.controller;

import com.example.gibiliAI.dto.TextGenerationRequestDTO;
import com.example.gibiliAI.service.GibiliArtService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*")
public class GenerationController {

    private final GibiliArtService gibiliArtService;

    public GenerationController(GibiliArtService gibiliArtService) {
        this.gibiliArtService = gibiliArtService;
    }

    @PostMapping(value = "/generate" , produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateGibiliArt(@RequestParam("image")MultipartFile image,
                                                    @RequestParam("prompt") String prompt){
        try{
            byte[] imageBytes = gibiliArtService.createGibiliArt(image, prompt);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    public ResponseEntity<byte[]> generateGibiliArtFromText(@RequestBody TextGenerationRequestDTO request) {
        try {
            byte[] imageBytes = gibiliArtService.createGibiliArtFromText(request.getText(), request.getStyle());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
