export interface LessonCardProps {
  title: string
  description: string
  tags: string[]
  author: string
  authorId?: string
  key?: number
}

export function LessonCard({ title, description, tags, author, authorId, key }: LessonCardProps) {
  return (
    <div className="flex flex-col w-full h-52 bg-gray-100 hover:bg-gray-50 rounded-lg p-5 gap-3">
      <div className="size-full gap-3">
        <div className="flex flex-row w-full">
          <h1 className="text-md text-black w-5/6">{title}</h1>
          <div className="text-[10px] w-1/6 justify-center items-center flex text-gray-700 select-none hover:bg-[#e6e6af] bg-[#EBEBDB] rounded-full px-2 py-1">$200</div>
        </div>
        <p className="text-sm h-full text-gray-500">{description}</p>
      </div>
      <div className="flex w-1/2 h-6 gap-2">
        {/* <div className="flex flex-row h-full">
          <img src="https://via.placeholder.com/150" className="w-full h-full object-cover rounded-lg" />
        </div> */}
        <div className="text-sm text-gray-500">
          {author}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {tags.map((tag, index) => (
          <div className="flex h-6 bg-[#EBEBDB] opacity-80 rounded-full" key={index}>
            <div className="flex size-full py-1 px-3 justify-center items-center">
              <div className="size-full text-[10px] opacity-100 flex items-center justify-center">
                {tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}