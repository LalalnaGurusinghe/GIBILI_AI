package com.example.gibiliAI.service;

import com.example.gibiliAI.client.StabilityAIClient;
import com.example.gibiliAI.dto.TextToImageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class GibiliArtService {

    private final StabilityAIClient stabilityAIClient;
    private final String apiKey;


    public GibiliArtService(StabilityAIClient stabilityAIClient,@Value("${stability.api.key}") String apiKey) {
        this.stabilityAIClient = stabilityAIClient;
        this.apiKey = apiKey;
    }

    /**
     * Resize image to valid SDXL dimensions
     * Valid dimensions: 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, 896x1152
     */
    private MultipartFile resizeImageForSDXL(MultipartFile originalImage) throws IOException {
        BufferedImage originalBufferedImage = ImageIO.read(new ByteArrayInputStream(originalImage.getBytes()));
        int originalWidth = originalBufferedImage.getWidth();
        int originalHeight = originalBufferedImage.getHeight();
        
        // Calculate aspect ratio
        double aspectRatio = (double) originalWidth / originalHeight;
        
        // Choose the best fitting SDXL dimensions based on aspect ratio
        int targetWidth, targetHeight;
        if (aspectRatio >= 1.5) {
            // Wide image
            targetWidth = 1536;
            targetHeight = 640;
        } else if (aspectRatio >= 1.4) {
            targetWidth = 1344;
            targetHeight = 768;
        } else if (aspectRatio >= 1.3) {
            targetWidth = 1216;
            targetHeight = 832;
        } else if (aspectRatio >= 1.1) {
            targetWidth = 1152;
            targetHeight = 896;
        } else if (aspectRatio >= 0.9) {
            // Square-ish image
            targetWidth = 1024;
            targetHeight = 1024;
        } else if (aspectRatio >= 0.8) {
            targetWidth = 896;
            targetHeight = 1152;
        } else if (aspectRatio >= 0.7) {
            targetWidth = 832;
            targetHeight = 1216;
        } else if (aspectRatio >= 0.6) {
            targetWidth = 768;
            targetHeight = 1344;
        } else {
            // Tall image
            targetWidth = 640;
            targetHeight = 1536;
        }
        
        // Resize the image
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.drawImage(originalBufferedImage, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();
        
        // Convert back to MultipartFile
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        
        return new MultipartFile() {
            @Override
            public String getName() { return originalImage.getName(); }
            @Override
            public String getOriginalFilename() { return originalImage.getOriginalFilename(); }
            @Override
            public String getContentType() { return "image/png"; }
            @Override
            public boolean isEmpty() { return imageBytes.length == 0; }
            @Override
            public long getSize() { return imageBytes.length; }
            @Override
            public byte[] getBytes() { return imageBytes; }
            @Override
            public java.io.InputStream getInputStream() { return new ByteArrayInputStream(imageBytes); }
            @Override
            public void transferTo(java.io.File dest) throws IOException, IllegalStateException {
                throw new UnsupportedOperationException();
            }
        };
    }

    public byte[] createGibiliArt(MultipartFile image, String prompt){
        // Use the user's prompt directly, only add Ghibli style if no prompt provided
        String basePrompt = prompt != null && !prompt.trim().isEmpty() ? prompt : "beautiful scene";
        String finalPrompt = basePrompt + ", in the beautiful detailed anime style of studio ghibli";
        String engineId = "stable-diffusion-xl-1024-v1-0";
        String stylePreset = "anime";

        System.out.println("User original prompt: " + prompt);
        System.out.println("Final prompt: " + finalPrompt);
        System.out.println("API Key: " + apiKey.substring(0, 10) + "...");

        try {
            if (image != null && !image.isEmpty()) {
                // Use image-to-image generation when image is provided
                System.out.println("Using image-to-image generation with uploaded image");
                System.out.println("Original image size: " + image.getSize() + " bytes");
                
                // Resize image to valid SDXL dimensions
                MultipartFile resizedImage = resizeImageForSDXL(image);
                System.out.println("Resized image size: " + resizedImage.getSize() + " bytes");
                
                return stabilityAIClient.generateImageFromImage(
                        "Bearer " + apiKey,
                        engineId,
                        resizedImage,
                        finalPrompt,
                        stylePreset
                );
            } else {
                // Use text-to-image generation when no image is provided
                System.out.println("Using text-to-image generation");
                TextToImageRequest requestPayload = new TextToImageRequest(finalPrompt, stylePreset);
                return stabilityAIClient.generateImageFromText(
                        "Bearer " + apiKey,
                        engineId,
                        requestPayload
                );
            }
        } catch (IOException e) {
            System.err.println("Image processing error: " + e.getMessage());
            throw new RuntimeException("Failed to process uploaded image", e);
        } catch (Exception e) {
            System.err.println("Stability AI API Error: " + e.getMessage());
            throw e;
        }
    }

    public byte[] createGibiliArtFromText(String text, String style) {
        // Use the actual user text as the main prompt
        String userPrompt = text != null && !text.trim().isEmpty() ? text : "beautiful scene";
        
        // Add style enhancement based on the style parameter
        String styleEnhancement;
        if (style != null && !style.equals("general")) {
            styleEnhancement = ", in " + style.replace("_", " ") + " style";
        } else {
            styleEnhancement = ", in the beautiful detailed anime style of studio ghibli";
        }
        
        String finalPrompt = userPrompt + styleEnhancement;
        String engineId = "stable-diffusion-xl-1024-v1-0";
        String stylePreset = style != null && !style.equals("general") ? style.replace("_","-") : "anime";

        System.out.println("User text input: " + text);
        System.out.println("Style: " + style);
        System.out.println("Final prompt: " + finalPrompt);

        TextToImageRequest requestPayload = new TextToImageRequest(finalPrompt , stylePreset);

        return stabilityAIClient.generateImageFromText(
                "Bearer " + apiKey,
                engineId,
                requestPayload
        );
    }

    public String getApiKey() {
        return apiKey;
    }


}
