import { Schema, type Document, models, model } from 'mongoose'

export interface IStore extends Document {
  storeId: string
  name: string
  address: string
  location: string
  latitude: number
  longitude: number
  parking: string
  since: string
  phone: string
  tags: string[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

const StoreSchema = new Schema<IStore>(
  {
    storeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    parking: { type: String, required: true },
    since: { type: String, required: true },
    phone: { type: String, default: '1522-3232' },
    tags: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
)

// 검색을 위한 인덱스
StoreSchema.index({ location: 1 })
StoreSchema.index({ name: 'text', address: 'text' })
StoreSchema.index({ tags: 1 })

const Store = models.Store || model<IStore>('Store', StoreSchema)

export default Store
