"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
// import { Category, ProductType, ProductStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import TiptapEditor from "@/components/TiptapEditor"; // Adjust the import path
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  salePrice?: number | null;
  sku: string;
  slug: string;
  productType: ProductType;
  weight?: number | null;
  dimensions?: string | null;
  stockQuantity: number;
  images?: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  categories: Category[];
  tags: ProductTag[];
  customFields?: { categoryFieldId: number; value: string }[];
}

interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  basePrice: Yup.string()
    .matches(/^\d*\.?\d+$/, "Base price must be a number")
    .required("Base price is required"),
  salePrice: Yup.string()
    .matches(/^\d*\.?\d+$/, "Sale price must be a number")
    .nullable(),
  sku: Yup.string().required("SKU is required"),
  slug: Yup.string().required("Slug is required"),
  productType: Yup.string().required("Product type is required"),
  weight: Yup.string()
    .matches(/^\d*\.?\d+$/, "Weight must be a number")
    .nullable(),
  dimensions: Yup.string().nullable(),
  stockQuantity: Yup.string()
    .matches(/^\d+$/, "Stock quantity must be a whole number")
    .required("Stock quantity is required"),
  images: Yup.string().nullable(),
  status: Yup.string().required("Status is required"),
  isFeatured: Yup.boolean(),
  categoryId: Yup.number()
    .required("Category is required")
    .typeError("Category is required"),
  customFields: Yup.object().optional(),
});

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]); // New images
  const [existingImages, setExistingImages] = useState<string[]>([]); // Existing images
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load products");
        toast.error("Failed to load products");
      }
    };

    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to load categories");
        toast.error("Failed to load categories");
      }
    };

    const loadTags = async () => {
      try {
        const { data } = await api.get("/product-tags");
        setTags(data.tags);
      } catch (error) {
        console.error("Failed to load tags");
        toast.error("Failed to load tags");
      }
    };

    loadProducts();
    loadCategories();
    loadTags();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      // Set existing images from the product
      try {
        const images = selectedProduct.images
          ? JSON.parse(selectedProduct.images)
          : [];
        setExistingImages(images);
      } catch (e) {
        setExistingImages(
          selectedProduct.images ? [selectedProduct.images] : []
        );
      }
      // Set selected category
      const category = categories.find(
        (c) => c.id === selectedProduct.categories[0]?.id
      );
      setSelectedCategory(category || null);
      // Clear new images when selecting a new product
      setSelectedImages([]);
    }
  }, [selectedProduct, categories]);

  const handleImageChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    const totalImages =
      existingImages.length + selectedImages.length + files.length;
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed.");
      event.target.value = null;
      return;
    }
    const newImages = files.map((file: File) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
    event.target.value = null;
  };

  const handleImageDelete = (type: "existing" | "new", index: number) => {
    if (type === "existing") {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSelectedImages((prev) => {
        const updatedImages = prev.filter((_, i) => i !== index);
        URL.revokeObjectURL(prev[index].preview);
        return updatedImages;
      });
    }
  };

  const handleImageUpload = async (setFieldValue) => {
    if (selectedImages.length === 0) {
      const combinedImages = [...existingImages];
      setFieldValue("images", JSON.stringify(combinedImages));
      return;
    }
    setImageLoading(true);
    const uploadedUrls = [];
    try {
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append("file", image.file);
        const response = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          uploadedUrls.push(response.data.url);
        }
      }
      const combinedImages = [...existingImages, ...uploadedUrls].slice(0, 5);
      const imagesJson = JSON.stringify(combinedImages);
      setFieldValue("images", imagesJson);
      toast.success(
        `${uploadedUrls.length} new image(s) uploaded successfully!`
      );
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to upload images");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete("/products", { data: { id } });
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete product");
    }
  };

  const handleUpdate = async (values: any, closeDrawer: () => void) => {
    setIsLoading(true);
    try {
      if (!values.slug) {
        values.slug = values.name.toLowerCase().replace(/\s+/g, "-");
      }

      const customFieldValues = values.customFields
        ? Object.entries(values.customFields).map(
          ([categoryFieldId, value]) => ({
            categoryFieldId: Number(categoryFieldId),
            value: String(value),
          })
        )
        : selectedProduct?.customFields || [];

      const formattedValues = {
        ...values,
        categoryId: Number(values.categoryId),
        basePrice: Number(values.basePrice),
        stockQuantity: Number(values.stockQuantity),
        salePrice: values.salePrice ? Number(values.salePrice) : null,
        weight: values.weight ? Number(values.weight) : null,
        images: values.images || null,
        isFeatured: values.isFeatured,
        customFields: customFieldValues,
      };

      const response = await api.put("/products", formattedValues);

      setProducts(
        products.map((p) =>
          p.id === values.id ? { ...p, ...response.data.product } : p
        )
      );

      toast.success("Product updated successfully");
      closeDrawer();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 mt-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => router.push("/admin/products/add")}>
          Add New Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categories[0]?.name || "-"}</TableCell>
                <TableCell>₹ {product.basePrice}</TableCell>
                <TableCell>
                  {product.salePrice ? `₹ ${product.salePrice}` : "-"}
                </TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{product.productType}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>{product.isFeatured ? "Yes" : "No"}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>

                  <Drawer direction="right">
                    <DrawerTrigger>
                      <Button
                        variant="default"
                        className="bg-blue-700 text-white hover:bg-blue-800"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Update
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-black max-w-screen-md w-full h-full overflow-y-scroll overflow-x-hidden pb-10">
                      <DrawerHeader className="p-4 my-4">
                        <DrawerTitle className="text-3xl text-center">
                          Update Product
                        </DrawerTitle>
                      </DrawerHeader>

                      {selectedProduct && (
                        <div className="px-4">
                          <Formik
                            initialValues={{
                              id: selectedProduct.id,
                              name: selectedProduct.name,
                              description: selectedProduct.description || "",
                              basePrice: String(selectedProduct.basePrice),
                              salePrice: selectedProduct.salePrice
                                ? String(selectedProduct.salePrice)
                                : "",
                              sku: selectedProduct.sku,
                              slug: selectedProduct.slug,
                              productType: selectedProduct.productType,
                              weight: selectedProduct.weight
                                ? String(selectedProduct.weight)
                                : "",
                              dimensions: selectedProduct.dimensions || "",
                              stockQuantity: String(
                                selectedProduct.stockQuantity
                              ),
                              images: selectedProduct.images || "",
                              status: selectedProduct.status,
                              isFeatured: selectedProduct.isFeatured,
                              categoryId:
                                selectedProduct.categories[0]?.id || "",
                              customFields: selectedProduct.customFields
                                ? Object.fromEntries(
                                  selectedProduct.customFields.map((cf) => [
                                    cf.categoryFieldId,
                                    cf.value,
                                  ])
                                )
                                : {},
                            }}
                            validationSchema={
                              selectedCategory &&
                                selectedCategory.fields.length > 0
                                ? ProductSchema.shape({
                                  customFields: Yup.object().shape(
                                    selectedCategory.fields.reduce(
                                      (schema, field) => {
                                        let fieldSchema =
                                          field.type === "NUMBER"
                                            ? Yup.number()
                                            : Yup.string();
                                        if (field.isRequired) {
                                          fieldSchema = fieldSchema.required(
                                            `${field.name} is required`
                                          );
                                        }
                                        return {
                                          ...schema,
                                          [field.id]: fieldSchema,
                                        };
                                      },
                                      {}
                                    )
                                  ),
                                })
                                : ProductSchema
                            }
                            validateOnChange={false}
                            onSubmit={async (values, { setSubmitting }) => {
                              const closeDrawer = () => {
                                const closeButton = document.querySelector(
                                  ".drawer-close-btn"
                                ) as HTMLButtonElement;
                                if (closeButton) closeButton.click();
                              };
                              await handleUpdate(values, closeDrawer);
                              setSubmitting(false);
                            }}
                          >
                            {({
                              isSubmitting,
                              setFieldValue,
                              values,
                              errors,
                              touched,
                            }) => (
                              <Form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Category Selection */}
                                  <div className="md:col-span-2">
                                    <Label htmlFor="categoryId">Category</Label>
                                    <Select
                                      onValueChange={(value) => {
                                        setFieldValue(
                                          "categoryId",
                                          Number(value)
                                        );
                                        const category = categories.find(
                                          (c) => c.id === Number(value)
                                        );
                                        setSelectedCategory(category || null);
                                      }}
                                      defaultValue={String(values.categoryId)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((category) => (
                                          <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                          >
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {errors.categoryId &&
                                      touched.categoryId && (
                                        <div className="text-red-500 text-sm">
                                          {errors.categoryId}
                                        </div>
                                      )}
                                  </div>

                                  {/* Basic Information */}
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
                                    <Label htmlFor="slug">Slug</Label>
                                    <Field name="slug" as={Input} id="slug" />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="mt-1 bg-white text-black"
                                      onClick={() => {
                                        const nameValue = values.name;
                                        if (nameValue) {
                                          const slugValue = nameValue
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-")
                                            .replace(/(^-|-$)/g, "");
                                          setFieldValue("slug", slugValue);
                                        }
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
                                    <Label htmlFor="sku">SKU</Label>
                                    <Field name="sku" as={Input} id="sku" />
                                    <ErrorMessage
                                      name="sku"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="productType">
                                      Product Type
                                    </Label>
                                    <Select
                                      onValueChange={(value) =>
                                        setFieldValue("productType", value)
                                      }
                                      defaultValue={values.productType}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select product type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PHYSICAL">
                                          Physical
                                        </SelectItem>
                                        <SelectItem value="DIGITAL">
                                          Digital
                                        </SelectItem>
                                        <SelectItem value="SERVICE">
                                          Service
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                      name="productType"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>

                                  {/* Pricing */}
                                  <div>
                                    <Label htmlFor="basePrice">
                                      Base Price
                                    </Label>
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
                                          if (
                                            /^\d*\.?\d*$/.test(value) ||
                                            value === ""
                                          ) {
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
                                    <Label htmlFor="salePrice">
                                      Sale Price (Optional)
                                    </Label>
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
                                          if (
                                            /^\d*\.?\d*$/.test(value) ||
                                            value === ""
                                          ) {
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

                                  {/* Inventory */}
                                  <div>
                                    <Label htmlFor="stockQuantity">
                                      Stock Quantity
                                    </Label>
                                    <Field
                                      name="stockQuantity"
                                      as={Input}
                                      id="stockQuantity"
                                      type="text"
                                      placeholder="0"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                          /^\d*$/.test(value) ||
                                          value === ""
                                        ) {
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
                                      onValueChange={(value) =>
                                        setFieldValue("status", value)
                                      }
                                      defaultValue={values.status}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="DRAFT">
                                          Draft
                                        </SelectItem>
                                        <SelectItem value="ACTIVE">
                                          Active
                                        </SelectItem>
                                        <SelectItem value="ARCHIVED">
                                          Archived
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                      name="status"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>

                                  {/* Featured Product */}
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="isFeatured"
                                      checked={values.isFeatured}
                                      onCheckedChange={(checked) =>
                                        setFieldValue("isFeatured", checked)
                                      }
                                    />
                                    <Label htmlFor="isFeatured">
                                      Featured Product
                                    </Label>
                                  </div>

                                  {/* Product Details */}
                                  <div>
                                    <Label htmlFor="weight">
                                      Weight (kg, Optional)
                                    </Label>
                                    <Field
                                      name="weight"
                                      as={Input}
                                      id="weight"
                                      type="text"
                                      placeholder="0.00"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                          /^\d*\.?\d*$/.test(value) ||
                                          value === ""
                                        ) {
                                          setFieldValue("weight", value);
                                        }
                                      }}
                                    />
                                    <ErrorMessage
                                      name="weight"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="dimensions">
                                      Dimensions (Optional)
                                    </Label>
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

                                  {/* Custom Fields */}
                                  {selectedCategory &&
                                    selectedCategory.fields.length > 0 && (
                                      <div className="md:col-span-2">
                                        <h3 className="text-lg font-semibold mb-2">
                                          Custom Fields for{" "}
                                          {selectedCategory.name}
                                        </h3>
                                        {selectedCategory.fields.map(
                                          (field) => (
                                            <div
                                              key={field.id}
                                              className="mb-4"
                                            >
                                              <Label
                                                htmlFor={`customFields.${field.id}`}
                                              >
                                                {field.name}{" "}
                                                {field.isRequired
                                                  ? "*"
                                                  : "(Optional)"}
                                              </Label>
                                              <Field
                                                name={`customFields.${field.id}`}
                                                type={
                                                  field.type === "NUMBER"
                                                    ? "number"
                                                    : "text"
                                                }
                                                as={Input}
                                                id={`customFields.${field.id}`}
                                              />
                                              <ErrorMessage
                                                name={`customFields.${field.id}`}
                                                component="div"
                                                className="text-red-500 text-sm"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}

                                  {/* Images */}
                                  <div className="md:col-span-2">
                                    <Label htmlFor="productImages">
                                      Product Images (Max 5)
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
                                    {(existingImages.length > 0 ||
                                      selectedImages.length > 0) && (
                                        <div className="mt-4">
                                          <h4 className="text-sm font-medium mb-2">
                                            Images:
                                          </h4>
                                          <div className="flex items-center flex-wrap gap-4">
                                            {existingImages.map((url, index) => (
                                              <div
                                                key={`existing-${index}`}
                                                className="relative w-fit"
                                              >
                                                <Image
                                                  src={
                                                    product?.images
                                                      ? typeof product.images ===
                                                        "string"
                                                        ? JSON.parse(
                                                          product.images
                                                        )[0]
                                                        : product.images[0]
                                                      : "https://icon-library.com/images/images-icon/images-icon-13.jpg"
                                                  }
                                                  alt={`Existing ${index + 1}`}
                                                  width={100}
                                                  height={100}
                                                  className="object-cover rounded-lg"
                                                />
                                                <Button
                                                  variant="default"
                                                  size="icon"
                                                  className="absolute -top-2 -right-2 bg-red-600 text-white !rounded-full w-6 h-6"
                                                  onClick={() =>
                                                    handleImageDelete(
                                                      "existing",
                                                      index
                                                    )
                                                  }
                                                >
                                                  X
                                                </Button>
                                              </div>
                                            ))}
                                            {selectedImages.map(
                                              (image, index) => (
                                                <div
                                                  key={`new-${index}`}
                                                  className="relative w-fit"
                                                >
                                                  <Image
                                                    src={image.preview}
                                                    alt={`New ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="object-cover rounded-lg"
                                                  />
                                                  <Button
                                                    variant="default"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 bg-red-600 text-white !rounded-full w-6 h-6"
                                                    onClick={() =>
                                                      handleImageDelete(
                                                        "new",
                                                        index
                                                      )
                                                    }
                                                  >
                                                    X
                                                  </Button>
                                                </div>
                                              )
                                            )}
                                          </div>
                                          <Button
                                            type="button"
                                            className="mt-4"
                                            onClick={() =>
                                              handleImageUpload(setFieldValue)
                                            }
                                            disabled={imageLoading}
                                          >
                                            {imageLoading
                                              ? "Uploading..."
                                              : "Upload Images"}
                                          </Button>
                                        </div>
                                      )}
                                    <Field
                                      name="images"
                                      as={Textarea}
                                      id="images"
                                      placeholder="Uploaded image URLs will appear here as JSON"
                                      className="mt-2 "
                                      readOnly
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                      Manage up to 5 images: delete existing or
                                      add new, then upload.
                                    </p>
                                    <ErrorMessage
                                      name="images"
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </div>

                                  {/* Description */}
                                  <div className="md:col-span-2">
                                    <Label htmlFor="description">
                                      Description
                                    </Label>
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
                                </div>

                                <DrawerFooter className="flex justify-between">
                                  <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full"
                                  >
                                    {isSubmitting
                                      ? "Updating..."
                                      : "Update Product"}
                                  </Button>
                                  <DrawerClose asChild>
                                    <Button
                                      variant="outline"
                                      className="drawer-close-btn"
                                    >
                                      Cancel
                                    </Button>
                                  </DrawerClose>
                                </DrawerFooter>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      )}
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center pt-40">
                No Products Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
