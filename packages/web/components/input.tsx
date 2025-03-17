export default function Input({ setValue, placeholder, type = "text" }: { setValue?: (value: string) => void, placeholder?: string, type?: string }) {
  return (
    <input
      className="w-full h-10 bg-white rounded-lg p-2 focus:outline-none resize-none"
      placeholder={placeholder}
      type={type}
      onChange={(event) => setValue?.(event.target.value)}
    />
  )
}
