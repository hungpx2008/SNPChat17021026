# ChatSNP Monorepo

ChatSNP là ứng dụng chat với bộ nhớ dài hạn, gồm:
- Frontend: Next.js.
- Backend: FastAPI (Postgres/Redis/Qdrant + Celery).
- Mem0: dịch vụ bộ nhớ dài hạn (embedding HF, LLM qua OpenRouter/LM Studio).

```text
.
├── backend/                  # FastAPI service (chat persistence, RAG, REST API)
├── frontend/                 # Next.js application (UI)
├── mem0-service/             # Mem0 server
├── docker/                   # Database bootstrap scripts
├── docker-compose.yml        # All services (frontend+backend+mem0+infra+workers)
├── docker-compose.pro.yml    # Production configuration
└── docs/                     # Tài liệu
```

## Yêu cầu
- Docker & Docker Compose
- Node 20+ (nếu chạy frontend dev thủ công)
- Python 3.11+ (nếu chạy backend dev thủ công)

## Cấu hình môi trường
- Sao chép file mẫu và điền khóa/URL cần thiết:
  ```bash
  cp .env.example .env
  cp .env.databases.example .env.databases
  cp backend/.env.example backend/.env
  cp mem0-service/.env.example mem0-service/.env
  cp frontend/.env.local.example frontend/.env.local
  ```
- Cần điền: `POSTGRES_*`, `OPENAI_API_KEY`/`OPENROUTER_API_KEY`, `HF_TOKEN` (Mem0 tải model HF), `NEXT_PUBLIC_BACKEND_URL`, các khóa Firebase. Nếu chưa có khóa LLM/HF, tính năng AI sẽ bị giới hạn.
- Frontend dev dùng `frontend/.env.local` (dev server cổng 9002); chạy bằng Docker thì Compose đọc `.env`.

## Docling Adaptive Chunking (Generic)
Pipeline Docling hiện dùng table serializer thích ứng để hoạt động với nhiều loại tài liệu khác nhau (không hard-code cho 1 biểu mẫu cụ thể):
- Bảng nhỏ: giữ Markdown + provenance cell (`page,row,col,row_key,col_key`).
- Bảng rộng: chuyển sang triplet để retrieval ổn định.
- Chunk có prefix ngữ cảnh từ `heading + row_key` để cải thiện câu hỏi theo dòng/bảng.
- Group-lock các chunk liền kề cùng `row_key` để hạn chế tách rời dữ liệu cùng dòng.

Các biến môi trường để tinh chỉnh:
- `DOCLING_CHUNK_MAX_TOKENS` (mặc định `512`): giới hạn token/chunk cho `HybridChunker`.
- `DOCLING_CHUNK_MERGE_PEERS` (mặc định `true`): gộp peers của Docling chunker.
- `DOCLING_TABLE_MARKDOWN_MAX_COLS` (mặc định `4`): ngưỡng số cột để giữ bảng ở mode Markdown.
- `DOCLING_TABLE_MARKDOWN_MAX_CELLS` (mặc định `36`): ngưỡng số ô dữ liệu để giữ bảng ở mode Markdown.
- `DOCLING_TABLE_GROUP_KEY_HINTS` (mặc định: `type,category,item,service,description,name,code,id,loai,muc,dich vu`): gợi ý cột khóa nhóm; để trống vẫn có fallback tự động.
- `DOCLING_TABLE_NORMALIZE_VALUES` (mặc định `true`): chuẩn hóa biểu thức tiền tệ/đơn vị (đa currency, đa unit).
- `DOCLING_PREFIX_HEADING_ROWKEY` (mặc định `true`): thêm prefix `heading + row_key` trước khi embedding.
- `DOCLING_GROUP_LOCK_ENABLED` (mặc định `true`): bật/tắt cơ chế group-lock.
- `DOCLING_GROUP_LOCK_MAX_CHARS` (mặc định `1800`): trần ký tự khi gộp chunk group-lock.

Lưu ý vận hành:
- Sau khi đổi các biến Docling/chunking ở trên, nên **re-process/re-index** các tài liệu đã upload để vector store phản ánh logic mới.

## 🚀 Chạy nhanh (Docker Compose)
- Đề xuất: chạy đủ stack (bind code để tiện dev) bằng file mặc định:
  ```bash
  docker compose --env-file .env up -d --build
  ```
- Prod-like (không bind code, build ảnh sạch): `docker compose --env-file .env -f docker-compose.pro.yml up -d --build`
- Dịch vụ: Frontend http://localhost:3000, Backend http://localhost:8000, Mem0 http://localhost:8888, Flower http://localhost:5555
- Dùng file `.pro` nhưng muốn frontend trỏ backend local thì export `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000` trước khi chạy (mặc định trong file đang hướng tới API production).
- Theo dõi/dừng: `docker compose logs -f backend` và `docker compose down`

## 🛠️ Chạy dev thủ công (Dành cho phát triển)

Nếu bạn muốn thay đổi code liên tục thì nên chạy thủ công từng phần như sau:

### 1. Khởi động Infrastructure (Databases & Mem0)
```bash
docker compose up -d postgres redis qdrant mem0
# Mem0 đọc các biến trong .env; cần HF_TOKEN/LLM key để embedding/LLM hoạt động.
```

### 2. Backend (FastAPI + Celery)
Mở một terminal mới:
```bash
cd backend
cp .env.example .env   # nếu chưa có
python -m venv .venv
source .venv/bin/activate  # (Với Windows thì dùng: .venv\Scripts\activate)
pip install -e .

# Chạy server FastAPI
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
*(Tùy chọn) Mở terminal khác và chạy Celery Worker nếu cần xử lý background task:*
```bash
celery -A src.worker.celery_app worker -Q chat_priority,data_batch,media_process \
  -c 2 --loglevel=info --broker=redis://localhost:6379/0 --result-backend=redis://localhost:6379/1
```

### 3. Frontend (Next.js)
Mở một terminal mới:
```bash
cd frontend
cp .env.local.example .env.local  # đảm bảo biến env dev có đủ
npm install
npm run dev
# Mở http://localhost:9002 (NEXT_PUBLIC_BACKEND_URL mặc định trỏ http://localhost:8000)
```

## ✅ Kiểm thử
- Backend: Cần cài đặt dev dependencies (ví dụ `pip install pytest`) và chạy `cd backend && pytest`
- Frontend: `cd frontend && npm run lint`

## 🌐 Publish & Mở Port Dự Án qua Cloudflare Tunnel

Để đưa dự án của bạn lên internet nhanh chóng (cho phép truy cập từ xa) mà không cần cấu hình NAT/Port Forwarding trên router, cách đơn giản nhất là dùng **Cloudflare Tunnel** (`cloudflared`).

### 1. Dùng Nhanh (Quick Tunnel - Không cần Domain)
Cách này sẽ cấp cho bạn một đường link HTTPS ngẫu nhiên dạng `*.trycloudflare.com`.

**Bước 1:** Cài đặt `cloudflared`:
- Trên macOS: `brew install cloudflare/cloudflare/cloudflared`
- Trên Linux/Windows: Tải từ [tài liệu chính thức của Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).

**Bước 2:** Mở port cho **Frontend** (port Docker mặc định là `3000`, nếu bạn đang chạy dev thủ công Next.js thì nhập `9002`):
```bash
cloudflared tunnel --url http://localhost:3000
```

**Bước 3:** Copy link liên kết ở phần terminal xuất hiện (ví dụ: `https://abcd-123.trycloudflare.com`) rồi chia sẻ cho người khác truy cập.

### 2. Dùng Tên Miền Riêng (Khuyên dùng cho Production)
**Bước 1:** Đăng nhập [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
**Bước 2:** Truy cập **Networks** > **Tunnels** > Nhấn **Create a tunnel**.
**Bước 3:** Đặt tên cho Tunnel và lưu lại lệnh cài đặt (Connector) chạy trên máy tính chạy ứng dụng của bạn.
**Bước 4:** Tại bước cấu hình **Public Hostname**, bạn thiết lập:
- Gắn **Domain/Subdomain** của bạn.
- Dịch vụ (Service): Chọn tính năng `HTTP` URL là `http://localhost:3000`.

*(Lưu ý: Nếu cần Backend cũng public để sử dụng App ngoài mạng nội bộ, hãy thêm 1 Public Hostname riêng biệt (ví dụ: `api.domain.com`) trỏ về `http://localhost:8000`. Đừng quên update biến `NEXT_PUBLIC_BACKEND_URL` trong file cấu hình `.env` cho Frontend trỏ về địa chỉ public mới nãy).*
