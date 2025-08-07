'use client'

import React, { useState } from 'react'
import { Input } from './input'
import { Button } from './button'
import { X, Plus } from 'lucide-react'

interface TagsProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

const Tags: React.FC<TagsProps> = ({
  tags,
  onChange,
  placeholder = '태그를 입력하세요! 한 글자 이상!',
}) => {
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
            className='bg-blue-100 text-blue-800 rounded-full text-xs flex items-center px-4 py-1 pr-2'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1 ml-1'
              aria-label={`${tag} 태그 삭제`}
            >
              <X className='h-3 w-3' />
            </button>
          </span>
        ))}
      </div>
      <div className='flex gap-2'>
        <Input
          type='text'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className='h-9'
        />
        <Button
          type='button'
          size='icon'
          variant='ghost'
          onClick={addTag}
          disabled={!input.trim() || input.trim().length <= 1}
          className='text-blue-600 hover:bg-blue-100 bg-blue-100 h-9 w-9'
          title='태그 추가'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default Tags
