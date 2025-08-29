"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { apiClient } from "@/utils/helper";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { log } from "node:console";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const VideoSchema = Yup.object().shape({
    websiteVideo: Yup.mixed().required("Video name is required"),
    phoneVideo: Yup.mixed().required("Phone Video name is required"),
    qualities: Yup.string().required("Qualities is required"),
    // imageUrl: Yup.mixed().required("Image is required"),
});

export default function CreateCategoryPage() {

    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values: {
        websiteVideo: string;
        phoneVideo: string;
        qualities: string;
    }) => {
        console.log("values", values);
        const formData = new FormData();
        formData.append("websiteVideo", values.websiteVideo);
        formData.append("phoneVideo", values.phoneVideo);
        formData.append("qualities", values.qualities);




        try {

            const response = await apiClient('https://demonoid.in:3542/hero/upload', { method: 'POST', body: formData, });
            console.log("response=====", response);


            if (response.message !== "Videos uploaded successfully") {
                throw new Error("Failed to create category");
            }

            toast("Success!", {
                description: "Uplord successfully",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            // navigate.back();
        } catch (error) {
            toast("Error!", {
                description: error.message || "Failed to create category",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    };

    return (
        <div className="mt-10 mx-auto p-6 min-h-[89vh] flex justify-center items-center flex-col w-full bg-black rounded-3xl">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Upload Hero Videos (Both Platforms)
            </h1>
            <Formik
                initialValues={{ websiteVideo: "", phoneVideo: "", qualities: "" }}
                validationSchema={VideoSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="space-y-6  w-full max-w-screen-sm flex flex-col justify-center items-center">

                        <div className="w-full relative">
                            <label htmlFor="websiteVideo" className="block text-sm pb-2 font-medium">
                                Vidio for desktop
                            </label>
                            {isLoading && (
                                <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                            )}
                            <Input
                                id="websiteVideo"
                                name="websiteVideo"
                                type="file"
                                accept="websiteVideo/*"
                                className=""
                                onChange={async (event) => {
                                    if (event.currentTarget.files) {
                                        setFieldValue("websiteVideo", event.currentTarget.files?.[0]);
                                    }
                                }
                                }
                            />
                            <Field
                                id="websiteVideo"
                                name="websiteVideo"
                                as={Input}
                                placeholder={
                                    isLoading
                                        ? "Uploading..."
                                        : "Image URL will appear here after upload"
                                }
                                readOnly
                                className={`mt-2 text-gray-400 ${values.websiteVideo.length > 3 ? "flex" : "hidden"
                                    }`}
                            />
                            <ErrorMessage
                                name="websiteVideo"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="w-full relative">
                            <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                Video For Mobile
                            </label>
                            {isLoading && (
                                <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                            )}
                            <Input
                                id="phoneVideo"
                                name="phoneVideo"
                                type="file"
                                accept="phoneVideo/*"
                                className=""
                                onChange={async (event) => {
                                    if (event.currentTarget.files) {
                                        setFieldValue("phoneVideo", event.currentTarget.files?.[0]);
                                    }
                                }
                                }
                            />
                            <Field
                                id="phoneVideo"
                                name="phoneVideo"
                                as={Input}
                                placeholder={
                                    isLoading
                                        ? "Uploading..."
                                        : "Image URL will appear here after upload"
                                }
                                readOnly
                                className={`mt-2 text-gray-400 ${values.phoneVideo.length > 3 ? "flex" : "hidden"
                                    }`}
                            />
                            <ErrorMessage
                                name="imageUrl"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>




                        <div className="w-full">
                            <label
                                htmlFor="qualities"
                                className="block text-sm pb-2 font-medium"
                            >
                                Qualities
                            </label>
                            <Field
                                id="qualities"
                                name="qualities"
                                as={Input}
                                placeholder="Enter qualities"
                            />
                            <ErrorMessage
                                name="qualities"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>



                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="bg-white text-black w-1/2 mx-auto"
                        >
                            {isSubmitting ? "Submitting..." : "Uplord Video"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
