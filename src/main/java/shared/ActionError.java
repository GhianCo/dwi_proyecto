package shared;

public class ActionError {

    private String code;
    private String description;

    public ActionError(String code, String description) {
        this.code = code;
        this.description = description;
    }

    // Getters y Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;

    }
}
