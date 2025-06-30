package service;

import jakarta.enterprise.context.ApplicationScoped;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONObject;

@ApplicationScoped
public class PublicApiService {

    private static final String API_KEY = "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";
    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";

    public String sendingOut(String userMessage) {
        String safeMessage = JSONObject.quote(userMessage);

        String requestBody = """
        {
          "model": "google/gemma-3-27b-it:free",
          "messages": [
            {"role": "user", "content": %s}
          ]
        }
        """.formatted(safeMessage);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Authorization", "Bearer " + API_KEY)
                    .header("Content-Type", "application/json")
                    .header("HTTP-Referer", "http://localhost")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.err.println("❌ API Error: " + response.body());
                return "❌ ไม่สามารถติดต่อ OpenRouter ได้";
            }

            JSONObject json = new JSONObject(response.body());
            JSONArray choices = json.getJSONArray("choices");
            JSONObject message = choices.getJSONObject(0).getJSONObject("message");
            return message.getString("content");

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ เกิดข้อผิดพลาดระหว่างเรียก AI";
        }
    }
}
