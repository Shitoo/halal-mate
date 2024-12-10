import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-block">
          <Image
            src="/halalmate.png"
            alt="Halal Mate"
            width={150}
            height={38}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>
    </header>
  )
}

