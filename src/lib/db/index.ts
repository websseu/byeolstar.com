import mongoose from 'mongoose'

// 전역 객체에 mongoose 연결 정보를 캐싱해서 개발 환경에서 핫리로드 시에도 재연결을 방지
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

// MongoDB에 연결하는 비동기 함수
export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI // 기본값으로 .env에 있는 MONGODB_URI 사용
) => {
  // 이미 연결된 커넥션이 있으면 그것을 재사용
  if (cached.conn) return cached.conn

  // MONGODB_URI가 없을 경우 에러 발생
  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  // 연결이 안 되어 있으면 새로운 연결을 시도하고, 그 결과를 promise로 저장
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI)

  // 연결이 완료되면 커넥션 객체를 저장
  cached.conn = await cached.promise

  // 커넥션 반환
  return cached.conn
}
