package shared;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class PathInfoExtractor {

    public static Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && !pathInfo.isEmpty()) {
            String[] pathParts = pathInfo.split("/");

            for (int i = 0; i < pathParts.length; i += 2) {
                if (i + 1 < pathParts.length) {
                    String key = pathParts[i];
                    String value = pathParts[i + 1];
                    params.put(key, value);
                }
            }
        }

        return params;
    }
}
