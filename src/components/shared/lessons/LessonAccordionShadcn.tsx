"use client";
import Link from "next/link";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import komponen Shadcn

interface CourseDialogProps {
  id: number;
}

const LessonAccordion = ({ id }: CourseDialogProps) => {
  return (
    // 'type="single"' artinya hanya satu item yang bisa terbuka dalam satu waktu
    <Accordion type="single" collapsible className="w-full curriculum">

      {/* SECTION 1 */}
      <AccordionItem value="item-1" className="mb-25px border border-borderColor dark:border-borderColor-dark rounded-md overflow-hidden">
        <AccordionTrigger className="flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark hover:no-underline">
          <span>Lesson #01</span>
        </AccordionTrigger>
        <AccordionContent className="p-10px md:px-30px bg-whiteColor dark:bg-whiteColor-dark">
          <ul className="divide-y divide-borderColor dark:divide-borderColor-dark">
            <li className="py-4 flex items-center justify-between flex-wrap">
              <div className="flex items-center">
                <i className="icofont-video-alt mr-10px text-primaryColor"></i>
                <Link href="/lessons/1" className="font-medium hover:text-primaryColor">
                  Course Intro
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">3.27</span>
                <Link href="/lessons/1" className="bg-primaryColor text-white text-xs px-3 py-1 rounded">
                  Preview
                </Link>
              </div>
            </li>
            {/* Tambahkan <li> lainnya di sini */}
          </ul>
        </AccordionContent>
      </AccordionItem>

      {/* SECTION 2 */}
      <AccordionItem value="item-2" className="mb-25px border border-borderColor dark:border-borderColor-dark rounded-md overflow-hidden">
        <AccordionTrigger className="flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark hover:no-underline">
          <span>Lesson #02</span>
        </AccordionTrigger>
        <AccordionContent className="p-10px md:px-30px bg-whiteColor dark:bg-whiteColor-dark">
          <p className="py-4">Isi konten lesson 2 di sini...</p>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
};

export default LessonAccordion;