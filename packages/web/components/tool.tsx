export default function Tool({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) {
  return (
    <div className="size-full p-1 bg-gray-50 hover:cursor-pointer hover:bg-gray-100 rounded-full" onClick={onClick}>
      {icon}
    </div>
  )
}