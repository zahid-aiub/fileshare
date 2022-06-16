export class ApiResponse {
    constructor(
        public statusCode: number,
        public  message?: String,
        public data?: Object,
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}