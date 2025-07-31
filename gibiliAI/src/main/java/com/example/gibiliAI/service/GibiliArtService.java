package com.example.gibiliAI.service;

import com.example.gibiliAI.client.StabilityAIClient;
import com.example.gibiliAI.dto.TextToImageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GibiliArtService {

    private final StabilityAIClient stabilityAIClient;
    private final String apiKey;


    public GibiliArtService(StabilityAIClient stabilityAIClient,@Value("${stability.api.key}") String apiKey) {
        this.stabilityAIClient = stabilityAIClient;
        this.apiKey = apiKey;
    }

    public byte[] createGibiliArt(MultipartFile image, String prompt){
        String finalPrompt = prompt != null ? prompt : "in the beautiful, detailed anime style of studio ghibli.";
        String engineId = "stable-diffusion-v1-6";
        String stylePreset = "anime";

        return stabilityAIClient.generateImageFromImage(
                "Bearer " + apiKey,
                engineId,
                image,
                finalPrompt,
                stylePreset
        );
    }

    public byte[] createGibiliArtFromText(String text, String style) {
        String finalPrompt = style != null ? style : "in the beautiful, detailed anime style of studio ghibli.";
        String engineId = "stable-diffusion-v1-6";
        String stylePreset = style.equals("general") ? "anime" : style.replace("_","-");

        TextToImageRequest requestPayload = new TextToImageRequest(finalPrompt , stylePreset);

        return stabilityAIClient.generateImageFromText(
                "Bearer " + apiKey,
                engineId,
                requestPayload
        );
    }


}
