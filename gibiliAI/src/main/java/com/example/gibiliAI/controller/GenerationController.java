package com.example.gibiliAI.controller;

import com.example.gibiliAI.dto.TextGenerationRequestDTO;
import com.example.gibiliAI.service.GibiliArtService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
public class GenerationController {

    private final GibiliArtService gibiliArtService;

    public GenerationController(GibiliArtService gibiliArtService) {
        this.gibiliArtService = gibiliArtService;
    }

    @PostMapping(value = "/generate" , produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateGibiliArt(@RequestParam(value = "image", required = false) MultipartFile image,
                                                    @RequestParam("prompt") String prompt){
        try{
            System.out.println("Received request - Image: " + (image != null ? "present" : "null") + ", Prompt: " + prompt);
            byte[] imageBytes = gibiliArtService.createGibiliArt(image, prompt);
            System.out.println("Generated image successfully, size: " + imageBytes.length + " bytes");
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        }catch (Exception e) {
            System.err.println("Error generating image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping(value = "/generate-text", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateGibiliArtFromText(@RequestBody TextGenerationRequestDTO request) {
        try {
            byte[] imageBytes = gibiliArtService.createGibiliArtFromText(request.getText(), request.getStyle());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping(value = "/generateGibiliArtFromText", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateGibiliArtFromTextAlternate(@RequestBody TextGenerationRequestDTO request) {
        try {
            byte[] imageBytes = gibiliArtService.createGibiliArtFromText(request.getText(), request.getStyle());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API is working!");
    }
}
