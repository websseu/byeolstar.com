import { MongoClient, ServerApiVersion } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('잘못되었거나 누락된 환경 변수: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 글로벌 변수를 사용하여 HMR(핫 모듈 리플레이스먼트)로 인해
  // 모듈이 다시 로드될 때도 MongoDB 클라이언트의 인스턴스를 유지함.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }

  if (!globalWithMongo._mongoClient) {
    // MongoDB 클라이언트가 없으면 새로 생성하여 할당
    globalWithMongo._mongoClient = new MongoClient(uri, options)
  }
  // 기존에 생성된 MongoDB 클라이언트를 사용
  client = globalWithMongo._mongoClient
} else {
  // 프로덕션 환경에서는 글로벌 변수를 사용하지 않고
  // 새로운 MongoDB 클라이언트 인스턴스를 생성하여 사용
  client = new MongoClient(uri, options)
}

// 모듈 범위에서 MongoDB 클라이언트를 내보냄.
// 이렇게 하면 클라이언트를 여러 함수에서 공유할 수 있음.
export default client
