import Link from 'next/link'

export default function HomePage() {
  return (
    <div className='py-4'>
      <div className='text-center mb-6'>
        <h1 className='text-4xl font-poppins font-black text-green-800 mb-2 uppercase'>
          <Link href='/starbucks'>☕ Starbucks</Link>
        </h1>
      </div>
    </div>
  )
}
