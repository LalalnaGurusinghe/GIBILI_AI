package com.example.gibiliAI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class GibiliAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GibiliAiApplication.class, args);
	}

}
