import { ArrowRightIcon, GlobeIcon, ImageIcon, Link1Icon, PaperPlaneIcon } from "@radix-ui/react-icons";
import Button from "./button";
import Tool from "./tool";

export interface PromptAreaProps {
  send?: boolean
  next?: boolean
  upload?: boolean
  image?: boolean
  webSearch?: boolean
  onSend?: () => void
  onNext?: () => void
  onUpload?: () => void
  onImage?: () => void
  onWebSearch?: () => void
  setPrompt?: (value: any) => any
}

export default function PromptArea({ send, next, upload, image, webSearch, onNext, onSend, onUpload, onImage, onWebSearch, setPrompt }: PromptAreaProps) {
  send = send ?? true
  next = next ?? false
  upload = upload ?? true
  image = image ?? true
  webSearch = webSearch ?? true
  return (
    <div className="flex w-full h-full bg-[#EBEBDB] rounded-2xl p-2 text-sm">
      <div className="flex flex-col w-full h-full gap-2">
        <div className="flex flex-grow-[1] w-full">
          {/* components */}
        </div>
        <div className="flex flex-grow-[10] w-full h-full">
          <textarea
            className="w-full h-full bg-white rounded-2xl p-2 focus:outline-none resize-none"
            onChange={(event) => setPrompt?.(event.target.value)}
          />
        </div>
        <div className="flex flex-row w-full">
        <div className="flex flex-grow-[1] gap-2">
          {upload && (
            <Tool icon={<Link1Icon />} onClick={onUpload!} />
          )}
          {image && (
            <Tool icon={<ImageIcon />} onClick={onImage!} />
          )}
          {webSearch && (
            <Tool icon={<GlobeIcon />} onClick={onWebSearch!} />
          )}
        </div>
        <div className="w-full flex-grow-[3] flex justify-end gap-2">
          {send && (
            <Button color="skyblue" onClick={onSend}>
              <PaperPlaneIcon className="w-4 h-4 mr-2"/> Send
            </Button>
          )}
          {next && (
            <Button color="#FC6262" onClick={onNext}>
              <ArrowRightIcon className="w-4 h-4 mr-2"/> Next
            </Button>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}