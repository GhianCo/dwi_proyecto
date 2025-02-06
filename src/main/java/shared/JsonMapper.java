package shared;

import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import org.json.JSONException;

public class JsonMapper {

    public static <T> T mapJsonToDto(JSONObject json, Class<T> dtoClass) {
        try {
            T dtoInstance = dtoClass.getDeclaredConstructor().newInstance();

            for (Field field : dtoClass.getDeclaredFields()) {
                field.setAccessible(true);

                String fieldName = field.getName();
                if (json.has(fieldName)) {
                    Object value = json.get(fieldName);

                    if (field.getType() == String.class) {
                        field.set(dtoInstance, value.toString());
                    } else if (field.getType() == int.class || field.getType() == Integer.class) {
                        field.set(dtoInstance, Integer.valueOf(value.toString()));
                    } else if (field.getType() == double.class || field.getType() == Double.class) {
                        field.set(dtoInstance, Double.valueOf(value.toString()));
                    } else if (field.getType() == boolean.class || field.getType() == Boolean.class) {
                        field.set(dtoInstance, Boolean.valueOf(value.toString()));
                    }
                    // Agregar más conversiones si es necesario
                }
            }

            return dtoInstance;
        } catch (IllegalAccessException | IllegalArgumentException | InstantiationException | NoSuchMethodException | SecurityException | InvocationTargetException | JSONException e) {
            throw new RuntimeException("Error al mapear JSON a DTO", e);
        }
    }
}
