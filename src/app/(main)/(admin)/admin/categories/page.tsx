"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { apiClient } from "@/utils/helper";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string(),
  imageUrl: Yup.string().url("Must be a valid URL").optional(),
});

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

type CategoryAll = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number; // if it’s only 0 | 1 you can type as 0 | 1
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  image: string; // URL of uploaded image
}

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setImageLoading] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const response = await fetch("/api/categories");
        const response = await apiClient<Category[]>('http://147.93.107.197:3542/categories');

        console.log("response", response);
        // const data = await response.json();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {

      // const response = await fetch(`/api/categories`, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ id }),
      // });
      const response = await apiClient<Category[]>(`http://147.93.107.197:3542/categories/${id}`, { method: 'DELETE' });
      console.log("response", response);


      if (response.message !== "Category deleted") {
        throw new Error("Failed to delete category");
      }

      setCategories(categories.filter((cat) => cat.id !== id));
      toast("Success!", {
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast("Error!", {
        description: "Failed to delete category",
      });
    }
  };

  const handleUpdate = async (values: {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
  }) => {
    try {
      const response = await fetch(`/api/categories`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: values.id,
          name: values.name,
          description: values.description,
          image: values.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      // Update the categories list with the updated category
      const updatedCategories = categories.map((cat) =>
        cat.id === values.id ? { ...cat, ...values } : cat
      );
      setCategories(updatedCategories);

      toast("Success!", {
        description: "Category updated successfully",
      });

      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      toast("Error!", {
        description: "Failed to update category",
      });
      return false;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="max-w-full mt-10 mx-auto p-6 bg-black rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => navigate.push("/admin/categories/add")}>
          Create New Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="space-x-4 max-w-28 text-center">
              Order
            </TableHead>
            <TableHead className="space-x-4 max-w-28 text-center">
              Name
            </TableHead>
            <TableHead className="space-x-4 max-w-28 text-center">
              Description
            </TableHead>
            <TableHead className="space-x-4 max-w-28 text-center">
              Image
            </TableHead>
            <TableHead className="space-x-4 max-w-28 text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, i) => (
            <TableRow key={category.id}>
              <TableCell className="space-x-4 max-w-28 text-center">
                {i + 1}
              </TableCell>
              <TableCell className="space-x-4 max-w-28 text-center">
                {category.name}
              </TableCell>
              <TableCell className="space-x-4 max-w-28 text-center">
                {category.description}
              </TableCell>
              <TableCell className="space-x-4 max-w-28 h-40 text-center">
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover rounded mx-auto h-28"
                    width={150}
                    height={150}
                  />
                )}
              </TableCell>
              <TableCell className="space-x-4 max-w-28 text-center">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </Button>

                <Drawer direction="right">
                  <DrawerTrigger>
                    <Button
                      variant="default"
                      className="bg-blue-700 text-white hover:bg-blue-800 ml-2"
                    >
                      Update
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-black max-w-screen-sm w-full h-full">
                    <DrawerHeader className="p-4 mt-10">
                      <DrawerTitle className="text-3xl text-center">
                        Update Category
                      </DrawerTitle>
                    </DrawerHeader>

                    <div className="px-4 mt-10">
                      <Formik
                        initialValues={{
                          id: category.id,
                          name: category.name,
                          description: category.description || "",
                          imageUrl: category.imageUrl || "",
                        }}
                        validationSchema={CategorySchema}
                        onSubmit={async (values, { setSubmitting }) => {
                          const success = await handleUpdate(values);
                          setSubmitting(false);
                          if (success) {
                            document
                              .querySelector<HTMLButtonElement>(
                                ".drawer-close-btn"
                              )
                              ?.click();
                          }
                        }}
                      >
                        {({ isSubmitting, setFieldValue, values }) => (
                          <Form className="space-y-6 w-full flex flex-col justify-center items-center">
                            <div className="w-full">
                              <label
                                htmlFor="name"
                                className="block text-sm pb-2 font-medium"
                              >
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
                              <label
                                htmlFor="image"
                                className="block text-sm pb-2 font-medium"
                              >
                                Category Image
                              </label>
                              {isImageLoading && (
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
                                    setImageLoading(true);
                                    try {
                                      const formData = new FormData();
                                      formData.append("file", file);
                                      const response = await api.post(
                                        "/upload",
                                        formData,
                                        {
                                          headers: {
                                            "Content-Type":
                                              "multipart/form-data",
                                          },
                                        }
                                      );
                                      console.log(response.data);
                                      if (response.status === 200) {
                                        setFieldValue(
                                          "imageUrl",
                                          response.data.url
                                        );
                                        toast("Success!", {
                                          description:
                                            "Image uploaded successfully",
                                        });
                                      } else {
                                        throw new Error(
                                          "Failed to upload image"
                                        );
                                      }
                                    } catch (error) {
                                      toast.error(
                                        error?.response?.data?.error ||
                                        "Failed to upload image"
                                      );
                                    } finally {
                                      setImageLoading(false);
                                    }
                                  }
                                }}
                              />
                              <Field
                                id="imageUrl"
                                name="imageUrl"
                                as={Input}
                                placeholder={
                                  isImageLoading
                                    ? "Uploading..."
                                    : "Image URL will appear here after upload"
                                }
                                readOnly
                                className="mt-2 text-gray-400"
                              />
                              <ErrorMessage
                                name="imageUrl"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            <DrawerFooter className="px-0 w-full">
                              <Button
                                type="submit"
                                disabled={isSubmitting || isImageLoading}
                                className="bg-blue-600 hover:bg-blue-500 text-white"
                              >
                                {isSubmitting
                                  ? "Updating..."
                                  : "Update Category"}
                              </Button>
                              <DrawerClose className="drawer-close-btn">
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                >
                                  Cancel
                                </Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </DrawerContent>
                </Drawer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
