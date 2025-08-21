"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { apiClient } from "@/utils/helper";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
    description: Yup.string(),
    imageUrl: Yup.string().url("Must be a valid URL").optional(),
});

export default function UplordImagePage() {
    type ImageUplord = {
        name: string;
        description?: string;
        imageUrl?: string;
    };
    const navigate = useRouter();
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values: {
        name: string;
        description?: string;
        image?: string;
    }) => {
        try {
            // const response = await api.post("/categories", {
            //   ...values,
            // });
            const response = await apiClient<ImageUplord[]>('http://localhost:3542/categories', { method: 'POST', body: { ...values } });
            console.log("response=====", response);


            if (response.message !== "Category created") {
                throw new Error("Failed to create category");
            }

            toast("Success!", {
                description: "Category created successfully",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            navigate.back();
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
                Uplord Video For Mobile View & Desktop View
            </h1>
            <Formik
                initialValues={{ name: "", description: "", imageUrl: "" }}
                validationSchema={CategorySchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="space-y-6  w-full max-w-screen-sm flex flex-col justify-center items-center">

                        <div className="w-full relative">
                            <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                Uplord First Mobile View Video
                            </label>
                            {isLoading && (
                                <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                            )}
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className=""
                                onChange={async (event) => {
                                    const file = event.currentTarget.files?.[0];
                                    if (file) {
                                        setLoading(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            const response = await api.post("/upload", formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });
                                            console.log(response.data);
                                            if (response.status === 200) {
                                                setFieldValue("imageUrl", response.data.url);
                                                toast("Success!", {
                                                    description: "Image uploaded successfully",
                                                });
                                            } else {
                                                throw new Error("Failed to upload image");
                                            }
                                        } catch (error) {
                                            toast.error(error?.response?.data?.error);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                            <Field
                                id="imageUrl"
                                name="imageUrl"
                                as={Input}
                                placeholder={
                                    isLoading
                                        ? "Uploading..."
                                        : "Image URL will appear here after upload"
                                }
                                readOnly
                                className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                    }`}
                            />
                            <ErrorMessage
                                name="imageUrl"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="w-full relative">
                            <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                Uplord Second Mobile View Video
                            </label>
                            {isLoading && (
                                <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                            )}
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className=""
                                onChange={async (event) => {
                                    const file = event.currentTarget.files?.[0];
                                    if (file) {
                                        setLoading(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            const response = await api.post("/upload", formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });
                                            console.log(response.data);
                                            if (response.status === 200) {
                                                setFieldValue("imageUrl", response.data.url);
                                                toast("Success!", {
                                                    description: "Image uploaded successfully",
                                                });
                                            } else {
                                                throw new Error("Failed to upload image");
                                            }
                                        } catch (error) {
                                            toast.error(error?.response?.data?.error);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                            <Field
                                id="imageUrl"
                                name="imageUrl"
                                as={Input}
                                placeholder={
                                    isLoading
                                        ? "Uploading..."
                                        : "Image URL will appear here after upload"
                                }
                                readOnly
                                className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                    }`}
                            />
                            <ErrorMessage
                                name="imageUrl"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="w-full relative">
                            <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                Uplord First Desktop View Video
                            </label>
                            {isLoading && (
                                <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                            )}
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className=""
                                onChange={async (event) => {
                                    const file = event.currentTarget.files?.[0];
                                    if (file) {
                                        setLoading(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            const response = await api.post("/upload", formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });
                                            console.log(response.data);
                                            if (response.status === 200) {
                                                setFieldValue("imageUrl", response.data.url);
                                                toast("Success!", {
                                                    description: "Image uploaded successfully",
                                                });
                                            } else {
                                                throw new Error("Failed to upload image");
                                            }
                                        } catch (error) {
                                            toast.error(error?.response?.data?.error);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                            <Field
                                id="imageUrl"
                                name="imageUrl"
                                as={Input}
                                placeholder={
                                    isLoading
                                        ? "Uploading..."
                                        : "Image URL will appear here after upload"
                                }
                                readOnly
                                className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                    }`}
                            />
                            <ErrorMessage
                                name="imageUrl"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="w-full relative">
                            <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                Uplord Second Desktop View Video
                            </label>
                            {isLoading && (
                                <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                            )}
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className=""
                                onChange={async (event) => {
                                    const file = event.currentTarget.files?.[0];
                                    if (file) {
                                        setLoading(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            const response = await api.post("/upload", formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });
                                            console.log(response.data);
                                            if (response.status === 200) {
                                                setFieldValue("imageUrl", response.data.url);
                                                toast("Success!", {
                                                    description: "Image uploaded successfully",
                                                });
                                            } else {
                                                throw new Error("Failed to upload image");
                                            }
                                        } catch (error) {
                                            toast.error(error?.response?.data?.error);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                            <Field
                                id="imageUrl"
                                name="imageUrl"
                                as={Input}
                                placeholder={
                                    isLoading
                                        ? "Uploading..."
                                        : "Image URL will appear here after upload"
                                }
                                readOnly
                                className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                    }`}
                            />
                            <ErrorMessage
                                name="imageUrl"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Crousel Video Uplord */}
                        <div>
                            <h1 className="text-2xl font-bold mb-6 text-center">
                                Uplord Image Of Crousel
                            </h1>


                            <div className="flex justify-between">

                                <div className="mr-9">
                                    <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                        Image 1
                                    </label>
                                    {isLoading && (
                                        <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                                    )}
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className=""
                                        onChange={async (event) => {
                                            const file = event.currentTarget.files?.[0];
                                            if (file) {
                                                setLoading(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const response = await api.post("/upload", formData, {
                                                        headers: {
                                                            "Content-Type": "multipart/form-data",
                                                        },
                                                    });
                                                    console.log(response.data);
                                                    if (response.status === 200) {
                                                        setFieldValue("imageUrl", response.data.url);
                                                        toast("Success!", {
                                                            description: "Image uploaded successfully",
                                                        });
                                                    } else {
                                                        throw new Error("Failed to upload image");
                                                    }
                                                } catch (error) {
                                                    toast.error(error?.response?.data?.error);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    <Field
                                        id="imageUrl"
                                        name="imageUrl"
                                        as={Input}
                                        placeholder={
                                            isLoading
                                                ? "Uploading..."
                                                : "Image URL will appear here after upload"
                                        }
                                        readOnly
                                        className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="imageUrl"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div className="">
                                    <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                        Image 2
                                    </label>
                                    {isLoading && (
                                        <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                                    )}
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className=""
                                        onChange={async (event) => {
                                            const file = event.currentTarget.files?.[0];
                                            if (file) {
                                                setLoading(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const response = await api.post("/upload", formData, {
                                                        headers: {
                                                            "Content-Type": "multipart/form-data",
                                                        },
                                                    });
                                                    console.log(response.data);
                                                    if (response.status === 200) {
                                                        setFieldValue("imageUrl", response.data.url);
                                                        toast("Success!", {
                                                            description: "Image uploaded successfully",
                                                        });
                                                    } else {
                                                        throw new Error("Failed to upload image");
                                                    }
                                                } catch (error) {
                                                    toast.error(error?.response?.data?.error);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    <Field
                                        id="imageUrl"
                                        name="imageUrl"
                                        as={Input}
                                        placeholder={
                                            isLoading
                                                ? "Uploading..."
                                                : "Image URL will appear here after upload"
                                        }
                                        readOnly
                                        className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="imageUrl"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-between">

                                <div className="mr-9">
                                    <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                        Image 3
                                    </label>
                                    {isLoading && (
                                        <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                                    )}
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className=""
                                        onChange={async (event) => {
                                            const file = event.currentTarget.files?.[0];
                                            if (file) {
                                                setLoading(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const response = await api.post("/upload", formData, {
                                                        headers: {
                                                            "Content-Type": "multipart/form-data",
                                                        },
                                                    });
                                                    console.log(response.data);
                                                    if (response.status === 200) {
                                                        setFieldValue("imageUrl", response.data.url);
                                                        toast("Success!", {
                                                            description: "Image uploaded successfully",
                                                        });
                                                    } else {
                                                        throw new Error("Failed to upload image");
                                                    }
                                                } catch (error) {
                                                    toast.error(error?.response?.data?.error);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    <Field
                                        id="imageUrl"
                                        name="imageUrl"
                                        as={Input}
                                        placeholder={
                                            isLoading
                                                ? "Uploading..."
                                                : "Image URL will appear here after upload"
                                        }
                                        readOnly
                                        className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="imageUrl"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div className="relative">

                                    <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                        Image 4
                                    </label>
                                    {isLoading && (
                                        <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                                    )}
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className=""
                                        onChange={async (event) => {
                                            const file = event.currentTarget.files?.[0];
                                            if (file) {
                                                setLoading(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const response = await api.post("/upload", formData, {
                                                        headers: {
                                                            "Content-Type": "multipart/form-data",
                                                        },
                                                    });
                                                    console.log(response.data);
                                                    if (response.status === 200) {
                                                        setFieldValue("imageUrl", response.data.url);
                                                        toast("Success!", {
                                                            description: "Image uploaded successfully",
                                                        });
                                                    } else {
                                                        throw new Error("Failed to upload image");
                                                    }
                                                } catch (error) {
                                                    toast.error(error?.response?.data?.error);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    <Field
                                        id="imageUrl"
                                        name="imageUrl"
                                        as={Input}
                                        placeholder={
                                            isLoading
                                                ? "Uploading..."
                                                : "Image URL will appear here after upload"
                                        }
                                        readOnly
                                        className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="imageUrl"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-start">


                                <div className="">
                                    <label htmlFor="image" className="block text-sm pb-2 font-medium">
                                        Image 5
                                    </label>
                                    {isLoading && (
                                        <div className="w-6 h-6 absolute border-2 right-4 top-10 rounded-full border-t-black animate-spin"></div>
                                    )}
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className=""
                                        onChange={async (event) => {
                                            const file = event.currentTarget.files?.[0];
                                            if (file) {
                                                setLoading(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const response = await api.post("/upload", formData, {
                                                        headers: {
                                                            "Content-Type": "multipart/form-data",
                                                        },
                                                    });
                                                    console.log(response.data);
                                                    if (response.status === 200) {
                                                        setFieldValue("imageUrl", response.data.url);
                                                        toast("Success!", {
                                                            description: "Image uploaded successfully",
                                                        });
                                                    } else {
                                                        throw new Error("Failed to upload image");
                                                    }
                                                } catch (error) {
                                                    toast.error(error?.response?.data?.error);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    <Field
                                        id="imageUrl"
                                        name="imageUrl"
                                        as={Input}
                                        placeholder={
                                            isLoading
                                                ? "Uploading..."
                                                : "Image URL will appear here after upload"
                                        }
                                        readOnly
                                        className={`mt-2 text-gray-400 ${values.imageUrl.length > 3 ? "flex" : "hidden"
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="imageUrl"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>



                            </div>

                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="bg-white text-black w-1/2 mx-auto"
                        >
                            {isSubmitting ? "Submitting..." : "Uplord Image"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
