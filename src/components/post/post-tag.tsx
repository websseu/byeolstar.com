'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'

interface PostTagProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

const PostTag: React.FC<PostTagProps> = ({ tags, onChange }) => {
  const [input, setInput] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const newTag = input.trim()
    if (newTag && !tags.includes(newTag) && newTag.length > 1) {
      onChange([...tags, newTag])
      setInput('')
    } else {
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-2'>
        {tags.map((tag) => (
          <span
            key={tag}
            className='bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='ml-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1'
              aria-label={`${tag} 태그 삭제`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <Input
        type='text'
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder='태그를 입력하고 Enter를 누르세요. 한 글자 이상!'
      />
    </div>
  )
}

export default PostTag
