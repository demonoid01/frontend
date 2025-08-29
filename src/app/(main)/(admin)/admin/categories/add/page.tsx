"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { apiClient } from "@/utils/helper";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { log } from "node:console";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string(),
  // imageUrl: Yup.string().url("Must be a valid URL").optional(),
  imageUrl: Yup.mixed().required("Image is required"),
});

export default function CreateCategoryPage() {
  type CategoryUplord = {
    name: string;
    description?: string;
    imageUrl?: string;
  };

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    // console.log("values", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    if (values.image) {
      formData.append("image", values.image); // must be a File object
    }



    try {
      // const response = await api.post("/categories", {
      //   ...values,
      // });
      // const response = await apiClient<CategoryUplord[]>('http://147.93.107.197:3542/categories', { method: 'POST', body: formData, });
      const response = await apiClient('https://147.93.107.197:3542/categories', { method: 'POST', body: formData, });
      // console.log("response=====", response);


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
        Create New Category
      </h1>
      <Formik
        initialValues={{ name: "", description: "", imageUrl: "" }}
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6  w-full max-w-screen-sm flex flex-col justify-center items-center">
            <div className="w-full">
              <label htmlFor="name" className="block text-sm pb-2 font-medium">
                Category Name
              </label>
              <Field
                id="name"
                name="name"
                as={Input}
                placeholder="Enter category name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="description"
                className="block text-sm pb-2 font-medium"
              >
                Description
              </label>
              <Field
                id="description"
                name="description"
                as={Input}
                placeholder="Enter description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="w-full relative">
              <label htmlFor="image" className="block text-sm pb-2 font-medium">
                Category Image
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
                  if (event.currentTarget.files) {
                    setFieldValue("imageUrl", event.currentTarget.files?.[0]);
                  }

                  // const file = event.currentTarget.files?.[0];
                  // if (file) {
                  //   setLoading(true);
                  //   setFieldValue("imageUrl", response.data.url);
                  //   toast("Success!", {
                  //     description: "Image uploaded successfully",
                  //   });

                  // try {
                  //   const formData = new FormData();
                  //   formData.append("file", file);
                  //   console.log("file===", formData);


                  //   const res = await apiClient<CategoryUplord[]>(
                  //     'http://147.93.107.197:3542/categories',
                  //     {
                  //       method: 'POST',
                  //       body: formData,
                  //     }
                  //   )

                  //   console.log("for image==", response);
                  //   if (response.status === 200) {
                  //     setFieldValue("imageUrl", response.data.url);
                  //     toast("Success!", {
                  //       description: "Image uploaded successfully",
                  //     });
                  //   } else {
                  //     throw new Error("Failed to upload image");
                  //   }
                  // } catch (error) {
                  //   toast.error(error?.response?.data?.error);
                  // } finally {
                  //   setLoading(false);
                  // }
                }
                }
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

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-white text-black w-1/2 mx-auto"
            >
              {isSubmitting ? "Submitting..." : "Create Category"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
