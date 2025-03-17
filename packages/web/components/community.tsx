'use client'

import { ArrowRightIcon } from "@radix-ui/react-icons"
import Button from "./button"
import Input from "./input"
import { LessonCard, LessonCardProps } from "./lesson-card"

export function Community() {
  const testData: LessonCardProps[] = [
    {
      title: "Lesson 1",
      description: "Lesson 1 description",
      tags: ["Tag 1", "Tag 2"],
      author: "Author 1"
    },
    {
      title: "Lesson 1",
      description: "Lesson 1 description",
      tags: ["Tag 1", "Tag 2"],
      author: "Author 1"
    },
    {
      title: "Lesson 1",
      description: "Lesson 1 description",
      tags: ["Tag 1", "Tag 2"],
      author: "Author 1"
    },
    {
      title: "Lesson 1",
      description: "Lesson 1 description",
      tags: ["Tag 1", "Tag 2"],
      author: "Author 1"
    },
    {
      title: "Lesson 1",
      description: "Lesson 1 description",
      tags: ["Tag 1", "Tag 2"],
      author: "Author 1"
    }
  ]
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 py-10">
        <div className="text-4xl">
          Community
        </div>
        <div className="w-full px-24 flex flex-row gap-2">
          <Input placeholder="Search for a lesson, examination or topic" />
          <div className="flex h-full">
            <Button color="#EBEBDB" size="lg">
              <ArrowRightIcon className="w-4 h-4 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full px-24">
        <div className="grid grid-cols-3 gap-4">
          {testData.map((lesson, index) => (
            <div className="flex size-full" key={index}>
              <LessonCard {...lesson} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}