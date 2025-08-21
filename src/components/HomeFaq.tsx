"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomeFaq() {
    return <>
        <section className="max-w-4xl mx-auto sm:mx-5 sm:max-w-full pb-10 px-4 sm:px-0">

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq">
                    <AccordionTrigger className="text-lg font-medium text-white">
                        Read About Us.
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 mt-6 text-white text-justify">

                        <div>
                            <p>
                                Welcome to Demonoid — Your Ultimate Car Accessory Destination. <br />
                                At Demonoid, we don’t just sell car accessories — we deliver experiences that transform the way you drive. Born from a passion for automobiles and powered by innovation,
                                Demonoid is your trusted partner in upgrading your vehicle with top-quality accessories imported directly from leading Chinese manufacturers.
                            </p>
                            <h3 className="text-lg font-medium pt-4 ">
                                What We Offer:
                            </h3>
                            <p className="pt-2">
                                High-Quality Car Accessories Every product is handpicked for durability, design, and performance. From LED lights to infotainment systems, floor mats to roof racks — our range is built for both functionality and flair.
                                Direct Import from China By sourcing directly from top factories in China, we cut out middlemen and pass the savings to you — without compromising on quality.
                                Free Home Installation Why go to a garage? Our expert team offers free doorstep installation services in selected areas, ensuring a smooth and professional fit for your accessories.
                                Stylish & Functional Upgrades Whether you're a daily commuter or a car enthusiast, our products help you personalize your ride with aesthetic appeal, convenience, and cutting-edge tech.

                            </p>
                        </div>
                        <div>

                            <h3 className="text-lg font-medium pt-4 ">
                                Why Choose Demonoid?
                            </h3>
                            <p className="pt-2">
                                Trusted by Car Owners Nationwide We’ve helped hundreds of car owners upgrade their vehicles — with zero compromises on quality and satisfaction.
                                Customer-First Approach From browsing to delivery and after-service, your convenience is our priority. We believe in support, not just sales.
                                Built for Indian Roads & Lifestyles Our accessories are carefully curated to match the needs of Indian drivers — durable, weatherproof, and stylish.

                            </p>
                        </div>
                        <div>

                            <h3 className="text-lg font-medium pt-4 ">
                                Our Vision
                            </h3>
                            <p className="pt-2">
                                To become India’s most loved car accessory brand by offering affordable luxury, modern tech, and unmatched service. Whether you’re modifying your car for performance, aesthetics, or comfort — Demonoid is here to gear you up.

                            </p>
                        </div>


                    </AccordionContent>
                </AccordionItem>
            </Accordion>


        </section>

    </>

}