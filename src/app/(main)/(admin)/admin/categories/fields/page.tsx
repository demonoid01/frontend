"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FieldSchema = Yup.object().shape({
  name: Yup.string().required("Field name is required"),
  type: Yup.string().required("Field type is required"),
  isRequired: Yup.boolean(),
  defaultValue: Yup.string().optional(),
});

export default function CategoryFieldsPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editField, setEditField] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error("Category load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFields(selectedCategory.fields || []);
    } else {
      setFields([]);
    }
  }, [selectedCategory]);

  const handleAddField = async (values, { resetForm }) => {
    try {
      const response = await api.post("/categories/category-fields", {
        categoryId: selectedCategory.id,
        ...values,
      });
      if (response.status === 201) {
        setFields([...fields, response.data.field]);
        toast.success("Field added successfully!");
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add field");
    }
  };

  const handleEditField = async (values, { resetForm }) => {
    try {
      const response = await api.put("/categories/category-fields", {
        id: editField.id,
        ...values,
      });
      if (response.status === 200) {
        setFields(
          fields.map((f) => (f.id === editField.id ? response.data.field : f))
        );
        setEditField(null);
        toast.success("Field updated successfully!");
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update field");
    }
  };

  const handleDeleteField = async (fieldId) => {
    try {
      const response = await api.delete("/categories/category-fields", {
        data: { id: fieldId },
      });
      if (response.status === 200) {
        setFields(fields.filter((f) => f.id !== fieldId));
        toast.success("Field deleted successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete field");
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading categories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto  flex justify-between items-start h-full">
      <div className="w-full max-w-3xl p-6">
        <h1 className="text-3xl font-bold text-center mb-8 mt-20">
          Manage Category Fields
        </h1>

        {/* Category Selection */}
        <div className="mb-6">
          <Label htmlFor="category">Select Category</Label>
          <Select
            onValueChange={(value) => {
              const category = categories.find((c) => c.id === Number(value));
              setSelectedCategory(category);
              setEditField(null);
            }}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <hr className="my-10 border-zinc-600" />

        {selectedCategory && (
          <>
            {/* Add/Edit Field Form */}
            <Formik
              initialValues={
                editField
                  ? {
                      name: editField.name,
                      type: editField.type,
                      isRequired: editField.isRequired,
                      defaultValue: editField.defaultValue || "",
                    }
                  : {
                      name: "",
                      type: "",
                      isRequired: false,
                      defaultValue: "",
                    }
              }
              validationSchema={FieldSchema}
              onSubmit={editField ? handleEditField : handleAddField}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-6 bg-black p-4 rounded-3xl">
                  <h3 className="text-xl  font-semibold">
                    {editField ? "Edit Selected Field" : "Create New Field"}
                  </h3>
                  <div>
                    <Label htmlFor="name">Field Name</Label>
                    <Field name="name" as={Input} id="name" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Field Type</Label>
                    <Select
                      onValueChange={(value) => setFieldValue("type", value)}
                      defaultValue={values.type}
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STRING">String</SelectItem>
                        <SelectItem value="NUMBER">Number</SelectItem>
                        <SelectItem value="BOOLEAN">Boolean</SelectItem>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="DATE">Date</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRequired"
                      checked={values.isRequired}
                      onCheckedChange={(checked) =>
                        setFieldValue("isRequired", checked)
                      }
                      className="size-6 bg-white/20"
                    />
                    <Label htmlFor="isRequired">Required</Label>
                  </div>
                  <div>
                    <Label htmlFor="defaultValue">
                      Default Value (Optional)
                    </Label>
                    <Field name="defaultValue" as={Input} id="defaultValue" />
                    <ErrorMessage
                      name="defaultValue"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {editField
                        ? isSubmitting
                          ? "Updating..."
                          : "Update Field"
                        : isSubmitting
                        ? "Adding..."
                        : "Add Field"}
                    </Button>
                    {editField && (
                      <Button
                        variant="destructive"
                        onClick={() => setEditField(null)}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
      {/* Field List */}
      <div className="mb-8 w-full max-w-xl border-l-2 pl-10 h-full">
        <h2 className="text-xl font-semibold mb-4">
          Fields for {selectedCategory?.name}
        </h2>
        {fields.length === 0 ? (
          <p>No fields defined for this category.</p>
        ) : (
          <ul className="space-y-4">
            {fields.map((field) => (
              <li
                key={field.id}
                className="flex justify-between items-center p-4 bg-black rounded"
              >
                <div>
                  <p>
                    <strong>{field.name}</strong> ({field.type})
                  </p>
                  <p>Default: {field.defaultValue || "None"}</p>
                  {/* Removed "Required: Yes/No" from here */}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setEditField(field)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
