'use client'

import Link from "next/link"
import Input from "./input"

export default function SignupForm() {
  return (
    <div className="size-full flex bg-[#EBEBDB] rounded-2xl p-6">
      <div className="flex flex-col w-full justify-between gap-4">
        <div className="flex w-full justify-center">
          <h1 className="text-2xl font-semibold text-gray-800">Sign Up</h1>
        </div>

        <div className="flex flex-col w-full space-y-3">
          <div className="flex w-full h-12">
            <Input setValue={() => { }} placeholder="Username" />
          </div>
          <div className="flex w-full h-12">
            <Input setValue={() => { }} placeholder="Email" type="email" />
          </div>
          <div className="flex w-full h-12">
            <Input setValue={() => { }} placeholder="Password" type="password" />
          </div>
          <div className="flex w-full h-12">
            <Input setValue={() => { }} placeholder="Confirm Password" type="password" />
          </div>
        </div>

        <div className="flex w-full justify-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-sky-600 hover:text-sky-700 hover:underline transition-colors duration-200">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
