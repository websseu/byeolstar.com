import { Schema, Document, models, model } from 'mongoose'

export interface IContact extends Document {
  email: string
  message: string
  status: '대기중' | '확인완료' | '답장완료'
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['대기중', '확인완료', '답장완료'],
      default: '대기중',
    },
  },
  { timestamps: true }
)

const Contact = models.Contact || model<IContact>('Contact', ContactSchema)

export default Contact
