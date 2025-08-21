"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  basePrice: Yup.number()
    .min(0, "Price must be positive")
    .required("Price is required"),
  salePrice: Yup.number().min(0, "Sale price must be positive").nullable(),
  sku: Yup.string().required("SKU is required"),
  slug: Yup.string().required("Slug is required"),
  productType: Yup.string().required("Product type is required"),
  weight: Yup.number().min(0, "Weight must be positive").nullable(),
  dimensions: Yup.string().nullable(),
  stockQuantity: Yup.number()
    .min(0, "Stock quantity must be positive")
    .required("Stock quantity is required"),
  images: Yup.string().nullable(),
  status: Yup.string().required("Status is required"),
  isFeatured: Yup.boolean(),
  categoryId: Yup.number()
    .required("Category is required")
    .typeError("Category is required"),
  customFields: Yup.object().optional(),
  tags: Yup.array().of(Yup.string()),
  variants: Yup.array().of(
    Yup.object().shape({
      sku: Yup.string().required("Variant SKU is required"),
      name: Yup.string().required("Variant name is required"),
      price: Yup.number()
        .min(0, "Price must be positive")
        .required("Price is required"),
      stock: Yup.number()
        .min(0, "Stock must be positive")
        .required("Stock is required"),
      attributes: Yup.object().required("Attributes are required"),
    })
  ),
});

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [validationSchema, setValidationSchema] = useState(ProductSchema);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      // try {
      //   setIsLoading(true); done by me
      //   const { data } = await api.get("/categories");
      //   setCategories(data.categories);
      // } catch (error) {
      //   toast.error("Failed to load categories");
      //   console.error("Category load error:", error);
      // } finally {
      //   setIsLoading(false);
      // }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const customFieldsSchema = selectedCategory.fields.reduce(
        (schema, field) => {
          let fieldSchema =
            field.type === "NUMBER" ? Yup.number() : Yup.string();
          if (field.isRequired) {
            fieldSchema = fieldSchema.required(`${field.name} is required`);
          }
          return { ...schema, [field.id]: fieldSchema };
        },
        {}
      );
      const updatedSchema = ProductSchema.shape({
        customFields: Yup.object().shape(customFieldsSchema),
      });
      setValidationSchema(updatedSchema);
    } else {
      setValidationSchema(ProductSchema);
    }
  }, [selectedCategory]);

  const handleImageChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    if (files.length + selectedImages.length > 10) {
      toast.error("Maximum 10 images allowed.");
      event.target.value = null;
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
    event.target.value = null;
  };

  const handleImageDelete = (index, values, setFieldValue) => {
    setSelectedImages((prev) => {
      const updatedImages = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updatedImages;
    });

    if (values.images) {
      const currentImages = JSON.parse(values.images);
      if (currentImages.length > index) {
        const updatedImages = currentImages.filter((_, i) => i !== index);
        setFieldValue("images", JSON.stringify(updatedImages));
      }
    }
  };

  const handleImageUpload = async (setFieldValue, values) => {
    if (selectedImages.length === 0) {
      toast.error("No images selected to upload.");
      return;
    }

    // Filter out images that have already been uploaded
    const newImagesToUpload = selectedImages.filter((img) => !img.uploaded);

    if (newImagesToUpload.length === 0) {
      toast.info("All selected images have already been uploaded.");
      return;
    }

    setImageLoading(true);
    try {
      // Create an array of upload promises
      const uploadPromises = newImagesToUpload.map((image) => {
        const formData = new FormData();
        formData.append("file", image.file);
        return api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      // Execute all uploads in parallel
      const responses = await Promise.all(uploadPromises);

      // Extract URLs from successful responses
      const newUrls = responses.map((response) => response.data.url);

      // Mark these images as uploaded
      setSelectedImages((prev) =>
        prev.map((img) => {
          if (
            newImagesToUpload.some((newImg) => newImg.preview === img.preview)
          ) {
            return { ...img, uploaded: true };
          }
          return img;
        })
      );

      // Update the form field with all URLs (existing + new)
      const existingUrls = values.images ? JSON.parse(values.images) : [];
      const allUrls = [...existingUrls, ...newUrls];
      setFieldValue("images", JSON.stringify(allUrls));

      toast.success(`${newUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to upload images");
      console.error("Upload error:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const {
        customFields,
        basePrice,
        salePrice,
        stockQuantity,
        weight,
        variants,
        tags,
        ...productData
      } = values;

      // Make sure images are properly parsed from the JSON string
      const imagesArray = values.images ? JSON.parse(values.images) : null;

      const customFieldValues = customFields
        ? Object.entries(customFields).map(([categoryFieldId, value]) => ({
          categoryFieldId: Number(categoryFieldId),
          value: String(value),
        }))
        : [];

      const formattedValues = {
        ...productData,
        categoryId: Number(values.categoryId),
        basePrice: Number(basePrice),
        salePrice: salePrice ? Number(salePrice) : null,
        stockQuantity: Number(stockQuantity),
        weight: weight ? Number(weight) : null,
        images: imagesArray, // Use the parsed array here
        customFields: customFieldValues,
        tags: tags,
        variants: variants ? { create: variants } : undefined,
      };

      const response = await api.post("/products", formattedValues);
      console.log(response);
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
      console.error("Submission error:", error);
    }
  };

  const generateSKU = (name, productType, categoryName) => {
    const categoryCode = categoryName?.slice(0, 3).toUpperCase() || "UNK";
    const typeCode = productType.slice(0, 2).toUpperCase();
    const nameCode = name.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${categoryCode}-${typeCode}${nameCode}-STD-${randomNum}`;
  };

  if (isLoading) {
    return (
      <div className="text-center p-6 h-80 flex justify-center items-center">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-16 mt-20">
        Create New Product
      </h1>
      <Formik
        initialValues={{
          name: "",
          description: "",
          basePrice: "",
          salePrice: "",
          sku: "",
          slug: "",
          productType: "PHYSICAL",
          weight: null,
          dimensions: null,
          stockQuantity: "",
          images: null,
          status: "ACTIVE",
          isFeatured: false,
          categoryId: "",
          customFields: {},
          tags: [],
          variants: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  onValueChange={(value) => {
                    setFieldValue("categoryId", Number(value));
                    const selectedCat = categories.find(
                      (c) => c.id === Number(value)
                    );
                    setSelectedCategory(selectedCat);
                  }}
                >
                  <SelectTrigger className="w-full h-14">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                        className="py-4"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && touched.categoryId && (
                  <div className="text-red-500 text-sm">
                    {errors.categoryId}
                  </div>
                )}
              </div>

              {selectedCategory && (
                <>
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Field name="name" as={Input} id="name" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <div className="flex gap-2">
                      <Field
                        name="sku"
                        as={Input}
                        id="sku"
                        readOnly
                        placeholder="Generate SKU"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white text-black"
                        onClick={() => {
                          const categoryName = categories.find(
                            (c) => c.id === Number(values.categoryId)
                          )?.name;
                          const sku = generateSKU(
                            values.name,
                            values.productType,
                            categoryName
                          );
                          setFieldValue("sku", sku);
                        }}
                      >
                        Generate SKU
                      </Button>
                    </div>
                    <ErrorMessage
                      name="sku"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Field
                      name="slug"
                      as={Input}
                      id="slug"
                      readOnly
                      placeholder="Generate Slug"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1 bg-white text-black"
                      onClick={() => {
                        const slugValue = values.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        setFieldValue("slug", slugValue);
                      }}
                    >
                      Generate from name
                    </Button>
                    <ErrorMessage
                      name="slug"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="productType">Product Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setFieldValue("productType", value)
                      }
                      defaultValue="PHYSICAL"
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHYSICAL">Physical</SelectItem>
                        <SelectItem value="DIGITAL">Digital</SelectItem>
                        <SelectItem value="SERVICE">Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="productType"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="basePrice">Base Price</Label>
                    <div className="flex items-center">
                      <span className="mr-5">₹</span>
                      <Field
                        name="basePrice"
                        as={Input}
                        id="basePrice"
                        type="text"
                        placeholder="0.00"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value) || value === "") {
                            setFieldValue("basePrice", value);
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="basePrice"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="salePrice">Sale Price (Optional)</Label>
                    <div className="flex items-center">
                      <span className="mr-5">₹</span>
                      <Field
                        name="salePrice"
                        as={Input}
                        id="salePrice"
                        type="text"
                        placeholder="0.00"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value) || value === "") {
                            setFieldValue("salePrice", value);
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="salePrice"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Field
                      name="stockQuantity"
                      as={Input}
                      id="stockQuantity"
                      type="text"
                      placeholder="0"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) || value === "") {
                          setFieldValue("stockQuantity", value);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="stockQuantity"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => setFieldValue("status", value)}
                      defaultValue="ACTIVE"
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg, Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Field
                        name="weight"
                        as={Input}
                        id="weight"
                        type="text"
                        placeholder="0.00"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) || value === "") {
                            setFieldValue("weight", value);
                          }
                        }}
                        className="max-w-28"
                      />
                      <span className="min-w-10">Kg</span>
                    </div>
                    <ErrorMessage
                      name="weight"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dimensions">Dimensions (Optional)</Label>
                    <Field
                      name="dimensions"
                      as={Input}
                      id="dimensions"
                      placeholder="e.g., 10x20x30 cm"
                    />
                    <ErrorMessage
                      name="dimensions"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Tags and isFeatured Section */}
                  <div className="md:col-span-2">
                    <Label>Tags and Features</Label>
                    <div className="flex gap-4 flex-wrap">
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="tags"
                          value="Best Seller"
                          className="mr-2"
                        />
                        Best Seller
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="tags"
                          value="Crazy Deal"
                          className="mr-2"
                        />
                        Crazy Deal
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="isFeatured"
                          className="mr-2"
                        />
                        Featured Product
                      </label>
                    </div>
                  </div>

                  {/* Variants Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Product Variants
                    </h3>
                    <Field name="variants">
                      {({ field }) => (
                        <div>
                          {field.value.map((variant, index) => (
                            <div
                              key={index}
                              className="border p-4 mb-4 rounded"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Variant SKU</Label>
                                  <Input
                                    value={variant.sku}
                                    onChange={(e) => {
                                      const newVariants = [...field.value];
                                      newVariants[index].sku = e.target.value;
                                      setFieldValue("variants", newVariants);
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`variants[${index}].sku`}
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label>Variant Name</Label>
                                  <Input
                                    value={variant.name}
                                    onChange={(e) => {
                                      const newVariants = [...field.value];
                                      newVariants[index].name = e.target.value;
                                      setFieldValue("variants", newVariants);
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`variants[${index}].name`}
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label>Price</Label>
                                  <Input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => {
                                      const newVariants = [...field.value];
                                      newVariants[index].price = e.target.value;
                                      setFieldValue("variants", newVariants);
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`variants[${index}].price`}
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label>Stock</Label>
                                  <Input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => {
                                      const newVariants = [...field.value];
                                      newVariants[index].stock = e.target.value;
                                      setFieldValue("variants", newVariants);
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`variants[${index}].stock`}
                                    component="div"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-2">
                                <Label>Attributes (e.g., Size, Wattage)</Label>
                                {Object.entries(variant.attributes).map(
                                  ([key, value], attrIndex) => (
                                    <div
                                      key={attrIndex}
                                      className="flex gap-2 mt-2"
                                    >
                                      <Input
                                        placeholder="Key"
                                        value={key}
                                        onChange={(e) => {
                                          const newVariants = [...field.value];
                                          const newAttributes = {
                                            ...newVariants[index].attributes,
                                          };
                                          delete newAttributes[key];
                                          newAttributes[e.target.value] = value;
                                          newVariants[index].attributes =
                                            newAttributes;
                                          setFieldValue(
                                            "variants",
                                            newVariants
                                          );
                                        }}
                                      />
                                      <Input
                                        placeholder="Value"
                                        value={value}
                                        onChange={(e) => {
                                          const newVariants = [...field.value];
                                          newVariants[index].attributes[key] =
                                            e.target.value;
                                          setFieldValue(
                                            "variants",
                                            newVariants
                                          );
                                        }}
                                      />
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          const newVariants = [...field.value];
                                          delete newVariants[index].attributes[
                                            key
                                          ];
                                          setFieldValue(
                                            "variants",
                                            newVariants
                                          );
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => {
                                    const newVariants = [...field.value];
                                    newVariants[index].attributes = {
                                      ...newVariants[index].attributes,
                                      "": "",
                                    };
                                    setFieldValue("variants", newVariants);
                                  }}
                                >
                                  Add Attribute
                                </Button>
                              </div>
                              <Button
                                variant="destructive"
                                className="mt-2"
                                onClick={() => {
                                  const newVariants = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  setFieldValue("variants", newVariants);
                                }}
                              >
                                Remove Variant
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            onClick={() => {
                              const newVariants = [
                                ...field.value,
                                {
                                  sku: "",
                                  name: "",
                                  price: "",
                                  stock: "",
                                  attributes: {},
                                },
                              ];
                              setFieldValue("variants", newVariants);
                            }}
                          >
                            Add Variant
                          </Button>
                        </div>
                      )}
                    </Field>
                  </div>

                  {/* Dynamic Custom Fields */}
                  {selectedCategory && selectedCategory.fields.length > 0 && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-2">
                        Custom Fields for {selectedCategory?.name}
                      </h3>
                      {selectedCategory.fields.map((field) => (
                        <div key={field.id} className="mb-4">
                          <Label htmlFor={`customFields.${field.id}`}>
                            {field.name} {field.isRequired ? "*" : "(Optional)"}
                          </Label>
                          <Field
                            name={`customFields.${field.id}`}
                            type={field.type === "NUMBER" ? "number" : "text"}
                            as={Input}
                            id={`customFields.${field.id}`}
                          />
                          <ErrorMessage
                            name={`customFields.${field.id}`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Image Selection, Preview, and Upload */}
                  <div className="md:col-span-2">
                    <Label htmlFor="productImages">
                      Product Images (Max 10)
                    </Label>
                    <Input
                      id="productImages"
                      name="productImages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="mb-2"
                      onChange={handleImageChange}
                    />
                    {selectedImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Selected Images:
                        </h4>
                        <div className="flex items-center flex-wrap gap-4">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative w-fit">
                              <Image
                                src={image.preview}
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={100}
                                className={`object-cover rounded-lg ${image.uploaded
                                  ? "border-2 border-green-500"
                                  : ""
                                  }`}
                              />
                              {image.uploaded && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                  ✓
                                </div>
                              )}
                              <Button
                                variant="default"
                                size="icon"
                                className="absolute -top-2 -right-2 bg-red-600 text-white !rounded-full w-6 h-6"
                                onClick={() =>
                                  handleImageDelete(
                                    index,
                                    values,
                                    setFieldValue
                                  )
                                }
                              >
                                X
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          className="mt-4"
                          onClick={() =>
                            handleImageUpload(setFieldValue, values)
                          }
                          disabled={imageLoading}
                        >
                          {imageLoading ? "Uploading..." : "Upload Images"}
                        </Button>
                      </div>
                    )}
                    <Field
                      name="images"
                      as={Textarea}
                      id="images"
                      placeholder='Uploaded image URLs will appear here as JSON (e.g., ["url1.jpg", "url2.jpg"])'
                      className="mt-2 hidden"
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Select up to 10 images, then click "Upload Images" to save
                      them.
                    </p>
                    <ErrorMessage
                      name="images"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* TipTap Editor for Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <TiptapEditor
                      value={values.description}
                      onChange={(content) =>
                        setFieldValue("description", content)
                      }
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
