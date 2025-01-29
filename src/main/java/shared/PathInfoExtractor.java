package shared;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class PathInfoExtractor {

    public static Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && !pathInfo.isEmpty()) {
            String[] pathParts = pathInfo.split("/");
            List<String> cleanedPathParts = Arrays.stream(pathParts)
                    .filter(part -> !part.isEmpty())
                    .collect(Collectors.toList());
            
            if (cleanedPathParts.size() % 2 != 0) {
                throw new IllegalArgumentException("La ruta contiene un número impar de parámetros.");
            }

            for (int i = 0; i < cleanedPathParts.size(); i += 2) {
                String key = cleanedPathParts.get(i);
                String value = cleanedPathParts.get(i + 1);
                params.put(key, value);
            }
        }

        return params;
    }
}
