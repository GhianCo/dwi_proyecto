package http;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public class JsonRequestWrapper extends HttpServletRequestWrapper {

    private final String jsonBody;

    public JsonRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);

        // Leer el cuerpo JSON de la solicitud y almacenarlo en memoria
        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream(), StandardCharsets.UTF_8))) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // Almacenar el cuerpo JSON como una cadena para poder acceder a él más tarde
        this.jsonBody = sb.toString();
    }

    @Override
    public BufferedReader getReader() throws IOException {
        // Retornar un BufferedReader con el cuerpo JSON que ya hemos almacenado
        return new BufferedReader(new InputStreamReader(new ByteArrayInputStream(jsonBody.getBytes(StandardCharsets.UTF_8))));
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        // Retornar un ServletInputStream con el cuerpo JSON que ya hemos almacenado
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(jsonBody.getBytes(StandardCharsets.UTF_8));
        return new ServletInputStream() {
            @Override
            public int read() throws IOException {
                return byteArrayInputStream.read();
            }

            @Override
            public boolean isFinished() {
                return byteArrayInputStream.available() == 0;
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
                throw new UnsupportedOperationException("Not supported yet.");
            }
        };
    }

    // Método para obtener el cuerpo JSON como un String
    public String getJsonBody() {
        return this.jsonBody;
    }
}
