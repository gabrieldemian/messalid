import clsx from 'clsx'
import { Accessor, JSX, JSXElement } from 'solid-js'

const variants = {
  outlined: 'border-2 border-lavender text-lavender',
  filled: 'bg-lavender text-white',
} as const

interface Props {
  className?: string
  variant?: keyof typeof variants
  isRounded?: boolean
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  isFluid?: boolean
  children: JSXElement
  isDisabled?: Accessor<boolean>
}

const Button = (props: Props) => {
  // destructuring everything except `isDisabled`
  // because it is reactive, and it would lose it's
  // reactivity if I did it.
  const {
    variant = 'filled',
    className = '',
    isRounded = true,
    isFluid = false,
    children,
    onClick,
  } = props
  const isFilled = variant === 'filled'

  // eslint-disable-next-line
  let elRef = (<button />) as HTMLButtonElement

  const classes = clsx(
    'px-3 py-2 duration-300 cursor-pointer',
    'hover:bg-mauv',
    'disabled:cursor-not-allowed disabled:opacity-75',
    isFilled && 'shadow-[0_4px_0_rgb(var(--mauve))]',
    isFluid ? 'w-full' : 'w-[fit-content]',
    isRounded && 'rounded-lg',
    variants[variant],
    className,
  )

  const pressButtonUp = () => {
    if (isFilled) {
      elRef.classList.add('shadow-[0_4px_0_rgb(var(--mauve))]')
      elRef.style.transform = 'translateY(0px)'
    }
  }

  const pressButtonDown = () => {
    if (isFilled) {
      elRef.classList.remove('shadow-[0_4px_0_rgb(var(--mauve))]')
      elRef.style.transform = 'translateY(3px)'
    }
  }

  return (
    <button
      ref={elRef}
      onMouseUp={pressButtonUp}
      onMouseDown={pressButtonDown}
      onClick={onClick}
      class={classes}
      disabled={props.isDisabled?.()}
    >
      {children}
    </button>
  )
}

export default Button
