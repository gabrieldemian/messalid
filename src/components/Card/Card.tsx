import clsx from 'clsx'
import { JSXElement } from 'solid-js'

const variants = {
  outlined: 'border-2 border-pink',
  filled: 'bg-pink text-white',
} as const

interface Props {
  className?: string
  variant?: keyof typeof variants
  isRounded?: boolean
  isFluid?: boolean
  children: JSXElement
}

const Card = ({
  variant = 'outlined',
  className = '',
  isRounded = true,
  isFluid = false,
  children,
}: Props) => {
  const classes = clsx(
    'p-5 bg-base duration-500 hover:shadow-lg cursor-pointer',
    isFluid ? 'w-full' : 'w-[fit-content]',
    isRounded && 'rounded-2xl',
    variants[variant],
    className,
  )

  return <div class={classes}>{children}</div>
}

export default Card
