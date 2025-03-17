export default function Button({ color, children, onClick, size = 'sm' }: { color: string, children: React.ReactNode, onClick?: () => void, size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={`px-4 flex items-center justify-center text-sm ${
        size === 'sm' ? 'rounded-2xl' : size === 'md' ? 'rounded-md' : 'rounded-lg'
      } p-2 ${
        size === 'sm' ? 'h-6' : size === 'md' ? 'h-8' : 'h-10'
      } text-white select-none hover:cursor-pointer hover:opacity-65`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
