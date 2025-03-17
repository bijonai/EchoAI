import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function PageSwitcher(
  { pageId, total, onSwitch }: { pageId: string, total: string, onSwitch?: (operation: "next" | "previous") => void }
) {
  return (
    <div className="bg-white w-32 h-9 rounded-xl flex">
      <div
        onClick={() => onSwitch?.("previous")}
        className="flex items-center justify-center w-9 h-full rounded-l-xl mr-auto hover:cursor-pointer hover:bg-gray-50">
        <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex items-center justify-center w-9 h-full select-none">
        <div className="text-sm text-gray-500">
          {`${pageId} / ${total}`}
        </div>
      </div>
      <div
        onClick={() => onSwitch?.("next")}
        className="flex items-center justify-center w-9 h-full rounded-r-xl ml-auto hover:cursor-pointer hover:bg-gray-50">
        <ArrowRightIcon className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  )
}