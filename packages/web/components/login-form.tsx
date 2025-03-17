'use client'

import Link from "next/link"
import Button from "./button"
import Input from "./input"
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function LoginForm() {
  return (
    <div className="size-full flex bg-[#EBEBDB] rounded-2xl p-6">
      <div className="flex flex-col w-full justify-between gap-4">
        <div className="flex w-full justify-center">
          <h1 className="text-2xl font-semibold text-gray-800">Login</h1>
        </div>

        <div className="flex flex-col w-full space-y-3">
          <div className="flex w-full h-12">
            <Input setValue={() => { }} placeholder="Email" />
          </div>
          <div className="flex w-full h-12">
            <Input setValue={() => { }} placeholder="Password" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center w-full">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">Or Login with</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-row w-full justify-center gap-3">
            <div className="flex flex-grow basis-0 bg-white rounded-lg">
              <div className="flex flex-row w-full h-11 justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer">
                <FontAwesomeIcon icon={faGoogle} className="text-lg text-gray-700" />
                <span className="font-medium text-gray-700">Google</span>
              </div>
            </div>
            <div className="flex flex-grow basis-0 bg-white rounded-lg">
              <div className="flex flex-row w-full h-11 justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer">
                <FontAwesomeIcon icon={faGithub} className="text-lg text-gray-700" />
                <span className="font-medium text-gray-700">Github</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <p className="text-gray-600">
            Have not an account?{" "}
            <Link href="/signup" className="text-sky-600 hover:text-sky-700 hover:underline transition-colors duration-200">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}