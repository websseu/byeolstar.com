import { Schema, Document, models, model, Types } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  category: string
  components?: string
  description?: string
  contents?: string
  image?: string
  tags?: string[]
  isPublished: boolean
  author?: string
  storeId?: Types.ObjectId
  numViews: number
  numLikes: number
  comments?: Types.ObjectId[]
  likes: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    components: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    contents: { type: String, default: '' },
    image: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    author: { type: String, trim: true, default: '' },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      index: true,
      required: false,
    },
    tags: { type: [String], default: [] },
    numViews: { type: Number, default: 0 },
    numLikes: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  },
  { timestamps: true }
)

// 검색을 위한 인덱스
PostSchema.index({ title: 'text', description: 'text', contents: 'text' })
PostSchema.index({ category: 1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ isPublished: 1 })

const Post = models.Post || model<IPost>('Post', PostSchema)

export default Post
