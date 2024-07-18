'use client'

type ButtonProps = {
  color: 'airbnb' | 'booking'
  onClick?: () => void
  children: React.ReactNode
}

const Button = ({ onClick, children, color }: ButtonProps) => {
  const colors = {
    airbnb: 'bg-airbnb hover:bg-white text-white hover:text-airbnb',
    booking: 'bg-booking hover:bg-white text-white hover:text-booking',
  }
  return (
    <button
      className={`${colors[color]} font-bold py-4 px-8 rounded-full`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
