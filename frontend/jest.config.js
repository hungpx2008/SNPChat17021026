const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Cung cấp đường dẫn đến ứng dụng Next.js của bạn để tải các tệp next.config.js và .env
  dir: './',
})

// Thêm bất kỳ cấu hình tùy chỉnh nào vào đây
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig được xuất theo cách này để đảm bảo next/jest có thể tải cấu hình Next.js
module.exports = createJestConfig(customJestConfig)