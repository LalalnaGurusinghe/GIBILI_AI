package com.example.gibiliAI.dto;

import java.util.List;

public class TextToImageRequest {

    private List<TextPrompt> tect_prompts;
    private double cfg_scale=7;
    private int height=512;
    private int width=768;
    private int steps = 30;
    private int samples=1;

    private String style_preset;


    //Constructor for initializing the request with text prompts and style preset
    public static class TextPrompt {
        private String text;

        public TextPrompt(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

    }

    // Default constructor for serialization/deserialization
    public TextToImageRequest(String text , String style){
        this.tect_prompts = List.of(new TextPrompt(text));
        this.style_preset = style;
    }

    // Getters for Json serialization
    public List<TextPrompt> getTect_prompts() {
        return tect_prompts;
    }

    public double getCfg_scale() {
        return cfg_scale;
    }

    public int getHeight() {
        return height;
    }

    public int getWidth() {
        return width;
    }

    public int getSteps() {
        return steps;
    }

    public int getSamples() {
        return samples;
    }

    public String getStyle_preset() {
        return style_preset;
    }

}
