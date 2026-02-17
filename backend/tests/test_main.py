from fastapi.testclient import TestClient
from app.main import app

# Khởi tạo một client để gọi API trong môi trường kiểm thử
client = TestClient(app)

def test_read_root():
    """
    Một ví dụ kiểm thử đơn giản:
    Kiểm tra xem endpoint gốc ("/") có trả về mã trạng thái 200 OK hay không.
    """
    response = client.get("/")
    assert response.status_code == 200
    # Bạn có thể thêm các kiểm tra khác cho nội dung trả về
    # assert response.json() == {"message": "Welcome to ChatSNP"}