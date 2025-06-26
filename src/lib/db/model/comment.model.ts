import { Schema, type Document, models, model } from 'mongoose'

export interface IComment extends Document {
  postId: string
  author: string
  content: string
  email?: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({ postId: 1, isDeleted: 1, createdAt: -1 })

const Comments = models.Comments || model<IComment>('Comments', CommentSchema)

export default Comments
