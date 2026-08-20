class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400, field: str = "error"):
        self.message = message
        self.status_code = status_code
        self.field = field
