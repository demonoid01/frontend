"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FooterAccordion({ accordiondata }) {



    return (
        <section className="max-w-full mx-auto pb-10 ">
            {accordiondata?.map((item) => (
                <Accordion type="single" key={item.title} collapsible className="w-full">
                    <AccordionItem value="faq">
                        <AccordionTrigger className="text-xl  font-[Orbitron] font-bold text-black">
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 mt-6 text-black">
                            {item.pages.map((page) =>
                                <div>
                                    <ul className="space-y-2">
                                        <li key={page.path}>
                                            <Link
                                                href={page.path}
                                                className="text-black hover:text-gray-400 transition"
                                            >
                                                {page.name}
                                            </Link>
                                        </li>

                                    </ul>
                                </div>

                            )}

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            ))
            }
        </section>
    );
}
