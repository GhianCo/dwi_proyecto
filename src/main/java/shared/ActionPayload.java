package shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

public class ActionPayload {

    private int code;
    private Object data;
    private String message;
    private Object pagination;
    private ActionError error;

    public ActionPayload(int code, Object data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public ActionPayload(int code, Object data, String message, Object pagination) {
        this.code = code;
        this.data = data;
        this.message = message;
        this.pagination = pagination;
    }

    public ActionPayload(int code, Object data, String message, Object pagination, ActionError error) {
        this.code = code;
        this.data = data;
        this.message = message;
        this.pagination = pagination;
        this.error = error;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getPagination() {
        return pagination;
    }

    public void setPagination(Object pagination) {
        this.pagination = pagination;
    }

    public ActionError getError() {
        return error;
    }

    public void setError(ActionError error) {
        this.error = error;
    }

    public String toJson() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return mapper.writeValueAsString(this);
    }
}
