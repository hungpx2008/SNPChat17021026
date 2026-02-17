import { render, screen } from '@testing-library/react'
import Home from '@/app/page' // Giả sử trang chính của bạn là app/page.tsx

describe('Home Page', () => {
  it('renders a heading', () => {
    // Render component Home
    render(<Home />)

    // Tìm một phần tử heading (h1, h2, ...) có chứa văn bản "ChatSNP" (không phân biệt chữ hoa/thường)
    const heading = screen.getByRole('heading', { name: /chatsnp/i })

    // Kiểm tra xem phần tử đó có thực sự tồn tại trong tài liệu không
    expect(heading).toBeInTheDocument()
  })
})