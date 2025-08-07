import { Schema, Document, models, model, Types } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  isPublished: boolean
  storeId?: string
  numViews: number
  numLikes: number
  numFavorites: number
  numComments: number
  comments?: Types.ObjectId[]
  likes: Types.ObjectId[]
  favorites: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    isPublished: { type: Boolean, default: false },
    storeId: { type: String, trim: true },
    numViews: { type: Number, default: 0 },
    numLikes: { type: Number, default: 0 },
    numFavorites: { type: Number, default: 0 },
    numComments: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  },
  { timestamps: true }
)

// 검색을 위한 인덱스
PostSchema.index({ title: 'text' })
PostSchema.index({ isPublished: 1 })

const Post = models.Post || model<IPost>('Post', PostSchema)

export default Post
