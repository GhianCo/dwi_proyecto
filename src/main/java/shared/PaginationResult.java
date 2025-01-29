package shared;

public class PaginationResult<T, P> {
    private T data;
    private P pagination;

    public PaginationResult(T data, P pagination) {
        this.data = data;
        this.pagination = pagination;
    }

    public T getData() {
        return data;
    }

    public P getPagination() {
        return pagination;
    }
}