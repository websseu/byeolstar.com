import { Schema, Document, models, model } from 'mongoose'

export interface IStore extends Document {
  storeId: string
  name: string
  description: string
  address: string
  location: string
  latitude: number
  longitude: number
  parking: string
  directions: string
  since: string
  phone: string
  tags: string[]
  services: string[]
  facilities: string[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

const StoreSchema = new Schema<IStore>(
  {
    storeId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    location: { type: String, trim: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    parking: { type: String, trim: true },
    directions: { type: String, trim: true },
    since: { type: String, trim: true },
    phone: { type: String, trim: true },
    tags: { type: [String], default: [] },
    services: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
)

// 검색을 위한 인덱스
StoreSchema.index({ name: 'text', address: 'text', location: 'text' })
StoreSchema.index({ location: 1 })
StoreSchema.index({ tags: 1 })
StoreSchema.index({ latitude: 1, longitude: 1 })

const Store = models.Store || model<IStore>('Store', StoreSchema)

export default Store
