import { FC } from 'react'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PostTooltipProps {
  text: string
}

const PostTooltip: FC<PostTooltipProps> = ({ text }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className='tooltip' />
        </TooltipTrigger>
        <TooltipContent>
          <p className='text-white'>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PostTooltip
