"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Home,
  Smartphone,
  User,
  MapPin,
  SmartphoneNfc,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import api from "@/lib/api";
import { carsData } from "@/utils/carsData";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

interface Product {
  slug: string;
  name: string;
  images: string[] | string | null;
  id: number;
  description: string;
  basePrice: string;
  salePrice: string;
}

const InstallationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCityStateReadOnly, setIsCityStateReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [productDrawerView, setProductDrawerView] = useState<
    "categories" | "products"
  >("categories");
  const [isBrandDrawerOpen, setIsBrandDrawerOpen] = useState(false);
  const [isModelDrawerOpen, setIsModelDrawerOpen] = useState(false);
  const [isYearDrawerOpen, setIsYearDrawerOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{
    [category: string]: Product[];
  }>({});
  const [currentCategory, setCurrentCategory] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2005 + 1 },
    (_, i) => currentYear - i
  );

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("Please enter your full name")
      .min(3, "Name must be at least 3 characters"),
    mobileNumber: Yup.string()
      .matches(
        /^\+91-\d{10}$/,
        "Please enter a valid 10-digit mobile number with +91- prefix"
      )
      .required("Mobile number is required"),
    alternateMobileNumber: Yup.string()
      .matches(
        /^\+91-\d{10}$/,
        "Please enter a valid 10-digit mobile number with +91- prefix"
      )
      .notOneOf(
        [Yup.ref("mobileNumber")],
        "Alternate number should be different from primary number"
      ),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    location: Yup.string()
      .required("Full address is required")
      .min(10, "Please provide a complete address"),
    productSlugs: Yup.object().test(
      "has-products",
      "Please select at least one product from any category",
      (value) => {
        return Object.values(value).some((products) => products.length > 0);
      }
    ),
    date: Yup.date()
      .required("Installation date is required")
      .min(new Date(), "Date cannot be in the past")
      .nullable(),
    brand: Yup.string().required("Please select your car brand"),
    model: Yup.string().required("Please select your car model"),
    carModelYear: Yup.number()
      .required("Please select the car model year")
      .min(2005, "Year must be 2005 or later")
      .max(currentYear, "Year cannot be in the future"),
    specialInstructions: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      mobileNumber: "+91-",
      alternateMobileNumber: "",
      pincode: "",
      city: "",
      state: "",
      location: "",
      productSlugs: {} as { [category: string]: string[] },
      date: null as Date | null,
      brand: "",
      model: "",
      carModelYear: null as number | null,
      specialInstructions: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.post("installation", { ...values });
        if (!data) throw new Error("Something went wrong");
        toast.success("Installation request submitted successfully!");
        resetForm();
        setCurrentStep(0);
        setSelectedProducts({});
      } catch (error) {
        toast.error("Installation request failed! Please try again!");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Failed to load product categories");
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (slug: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${slug}`);
      const { category } = response.data;
      setProducts(category.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products for this category");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (value && !value.startsWith("+91-")) {
      formattedValue = "+91-" + value.replace("+91-", "");
    }
    const digits = formattedValue.replace("+91-", "").replace(/\D/g, "");
    formattedValue = "+91-" + digits.substring(0, 10);

    formik.setFieldValue(name, formattedValue);
  };

  const fetchLocationDetails = async () => {
    if (!formik.values.pincode || formik.values.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${formik.values.pincode}`
      );

      if (
        response.data[0]?.Status === "Success" &&
        response.data[0]?.PostOffice?.length > 0
      ) {
        formik.setFieldValue("state", response.data[0].PostOffice[0].State);
        formik.setFieldValue("city", response.data[0].PostOffice[0].District);
        setIsCityStateReadOnly(true);
        toast.success("Location details fetched successfully");
      } else {
        toast.error("Pincode not found. Please enter city and state manually.");
        setIsCityStateReadOnly(false);
      }
    } catch (error) {
      console.error("Failed to fetch location details:", error);
      toast.error("Failed to fetch location details. Please enter manually.");
      setIsCityStateReadOnly(false);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelection = (product: Product) => {
    const categoryName = categories.find(
      (c) => c.slug === currentCategory
    )?.name;
    if (!categoryName) return;

    const currentProducts = formik.values.productSlugs[categoryName] || [];
    const isSelected = currentProducts.includes(product.slug);

    let updatedProducts;
    if (isSelected) {
      updatedProducts = currentProducts.filter((slug) => slug !== product.slug);
    } else {
      updatedProducts = [...currentProducts, product.slug];
    }

    formik.setFieldValue("productSlugs", {
      ...formik.values.productSlugs,
      [categoryName]: updatedProducts,
    });

    setSelectedProducts((prev) => {
      const categoryProducts = prev[categoryName] || [];
      let updatedCategoryProducts;
      if (isSelected) {
        updatedCategoryProducts = categoryProducts.filter(
          (p) => p.slug !== product.slug
        );
      } else {
        updatedCategoryProducts = [...categoryProducts, product];
      }
      return {
        ...prev,
        [categoryName]: updatedCategoryProducts,
      };
    });
  };

  const handleNext = () => {
    const stepFields: { [key: number]: string[] } = {
      0: ["userName", "mobileNumber"],
      1: ["pincode", "city", "state", "location"],
      2: ["productSlugs"],
      3: ["brand", "model", "carModelYear"],
      4: ["date"],
    };

    const fields = stepFields[currentStep];
    fields.forEach((field) => formik.setFieldTouched(field, true));

    formik.validateForm().then((errors) => {
      const hasErrors = fields.some((field) => errors[field]);
      if (!hasErrors) {
        setCurrentStep(currentStep + 1);
      } else {
        toast.error(
          "Please fill all required fields correctly before proceeding."
        );
      }
    });
  };

  const stepTitles = [
    "Personal Information",
    "Address Details",
    "Product Selection",
    "Vehicle Information",
    "Schedule & Instructions",
  ];

  return (
    <div className="min-h-svh bg-gradient-to-t from-black to-white/20 py-12 px-0 sm:px-6 lg:px-8 md:pt-28 flex justify-center items-center">
      <div className="max-w-4xl w-full mx-auto bg-black rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative bg-indigo-600/10 pt-10">
            <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center p-8 max-md:relative max-md:h-80 max-md:pt-20">
              <div className="text-center text-white">
                <Home className="h-12 w-12 mb-4 mx-auto" />
                <h1 className="text-4xl max-sm:text-3xl font-bold mb-4">
                  Professional Installation Service
                </h1>
                <p className="text-lg max-sm:text-base opacity-90">
                  Schedule your perfect installation day with our expert team
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-4 text-center">
              Schedule Installation
            </h2>

            <p className="text-gray-300 text-center mb-6">
              {stepTitles[currentStep]}
            </p>

            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
              {[0, 1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
                    step === currentStep
                      ? "bg-indigo-600 text-white"
                      : step < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step + 1
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {currentStep === 0 && (
                <>
                  <div>
                    <Label htmlFor="userName" className="text-gray-100">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                      <Input
                        id="userName"
                        type="text"
                        name="userName"
                        placeholder="Enter your full name"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-700 bg-gray-800 text-white"
                      />
                      {formik.touched.userName && formik.errors.userName && (
                        <p className="text-red-500 text-sm mt-1 ml-2">
                          {formik.errors.userName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber" className="text-gray-100">
                      Mobile Number
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                      <Input
                        id="mobileNumber"
                        type="tel"
                        name="mobileNumber"
                        placeholder="+91-XXXXXXXXXX"
                        value={formik.values.mobileNumber}
                        onChange={handlePhoneChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-700 bg-gray-800 text-white"
                      />
                      {formik.touched.mobileNumber &&
                        formik.errors.mobileNumber && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {formik.errors.mobileNumber}
                          </p>
                        )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="alternateMobileNumber"
                      className="text-gray-100"
                    >
                      Alternate Mobile Number (Optional)
                    </Label>
                    <div className="relative">
                      <SmartphoneNfc className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                      <Input
                        id="alternateMobileNumber"
                        type="tel"
                        name="alternateMobileNumber"
                        placeholder="+91-XXXXXXXXXX"
                        value={formik.values.alternateMobileNumber}
                        onChange={handlePhoneChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-700 bg-gray-800 text-white"
                      />
                      {formik.touched.alternateMobileNumber &&
                        formik.errors.alternateMobileNumber && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {formik.errors.alternateMobileNumber}
                          </p>
                        )}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="pincode" className="text-gray-100">
                      Pincode
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                      <Input
                        id="pincode"
                        type="text"
                        name="pincode"
                        placeholder="Enter 6-digit pincode"
                        value={formik.values.pincode}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 6);
                          formik.setFieldValue("pincode", value);
                        }}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-24 py-3 rounded-lg border-gray-700 bg-gray-800 text-white"
                      />
                      <Button
                        type="button"
                        onClick={fetchLocationDetails}
                        className="absolute top-1.5 right-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors h-9"
                        disabled={loading || formik.values.pincode.length !== 6}
                      >
                        {loading ? (
                          <div className="w-5 h-5 rounded-full border-t-indigo-700 border-2 animate-spin"></div>
                        ) : (
                          "Get Area"
                        )}
                      </Button>
                      {formik.touched.pincode && formik.errors.pincode && (
                        <p className="text-red-500 text-sm mt-1 ml-2">
                          {formik.errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-100">
                        City
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                        <Input
                          id="city"
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          readOnly={isCityStateReadOnly}
                          disabled={!formik.values.pincode}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border-gray-700 bg-gray-800 text-white uppercase ${
                            isCityStateReadOnly ? "opacity-70" : ""
                          }`}
                        />
                        {formik.touched.city && formik.errors.city && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {formik.errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-gray-100">
                        State
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                        <Input
                          id="state"
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formik.values.state}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          readOnly={isCityStateReadOnly}
                          disabled={!formik.values.pincode}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border-gray-700 bg-gray-800 text-white uppercase ${
                            isCityStateReadOnly ? "opacity-70" : ""
                          }`}
                        />
                        {formik.touched.state && formik.errors.state && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {formik.errors.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-100">
                      Full Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-200" />
                      <Textarea
                        id="location"
                        name="location"
                        placeholder="Enter your complete address including house/flat number, street, landmark"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!formik.values.city || !formik.values.state}
                        className="w-full pl-10 py-3 rounded-lg border-gray-700 bg-gray-800 text-white min-h-24"
                      />
                      {formik.touched.location && formik.errors.location && (
                        <p className="text-red-500 text-sm mt-1 ml-2">
                          {formik.errors.location}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <Label className="text-gray-100">Products</Label>
                    <Button
                      onClick={() => setIsProductDrawerOpen(true)}
                      className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white flex justify-between items-center px-4"
                    >
                      <span>
                        {Object.values(selectedProducts).flat().length > 0
                          ? `${
                              Object.values(selectedProducts).flat().length
                            } Selected Parts`
                          : "Pick installation car parts"}
                      </span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    {formik.touched.productSlugs &&
                      formik.errors.productSlugs && (
                        <p className="text-red-500 text-sm mt-1 ml-2">
                          {formik.errors.productSlugs}
                        </p>
                      )}
                  </div>

                  {Object.entries(selectedProducts).map(
                    ([category, products]) => (
                      <div key={category} className="mt-4">
                        <Label className="text-gray-100 mb-2 block">
                          {category}
                        </Label>
                        <div className="grid grid-cols-1 gap-2">
                          {products.map((product) => {
                            const images = product.images
                              ? Array.isArray(product.images)
                                ? product.images
                                : JSON.parse(product.images)
                              : [];
                            return (
                              <div
                                key={product.slug}
                                className="bg-gray-800 rounded-lg p-2 flex items-center"
                              >
                                <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden relative mr-2">
                                  {images.length > 0 && (
                                    <Image
                                      src={images[0]}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <span className="text-base pl-2 text-white truncate flex-1">
                                  {product.name}
                                </span>
                                <Button
                                  variant="destructive"
                                  className="text-white text-xl"
                                  size={"icon"}
                                  onClick={() =>
                                    handleProductSelection(product)
                                  }
                                >
                                  ×
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div>
                    <Label className="text-gray-100">Car Brand</Label>
                    <Button
                      onClick={() => setIsBrandDrawerOpen(true)}
                      className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white flex justify-between items-center px-4"
                    >
                      <span>{formik.values.brand || "Select Brand"}</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    {formik.touched.brand && formik.errors.brand && (
                      <p className="text-red-500 text-sm mt-1 ml-2">
                        {formik.errors.brand}
                      </p>
                    )}
                  </div>

                  {formik.values.brand && (
                    <div>
                      <Label className="text-gray-100">Car Model</Label>
                      <Button
                        onClick={() => setIsModelDrawerOpen(true)}
                        disabled={!formik.values.brand}
                        className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white flex justify-between items-center px-4"
                      >
                        <span>{formik.values.model || "Select Model"}</span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      {formik.touched.model && formik.errors.model && (
                        <p className="text-red-500 text-sm mt-1 ml-2">
                          {formik.errors.model}
                        </p>
                      )}
                    </div>
                  )}

                  {formik.values.model && (
                    <div>
                      <Label className="text-gray-100">Car Model Year</Label>
                      <Button
                        onClick={() => setIsYearDrawerOpen(true)}
                        disabled={!formik.values.model}
                        className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white flex justify-between items-center px-4"
                      >
                        <span>
                          {formik.values.carModelYear
                            ? formik.values.carModelYear
                            : "Select Year"}
                        </span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      {formik.touched.carModelYear &&
                        formik.errors.carModelYear && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {formik.errors.carModelYear}
                          </p>
                        )}
                    </div>
                  )}
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div>
                    <Label className="text-gray-100">
                      Preferred Installation Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left h-12 rounded-lg border-gray-700 bg-gray-800 hover:bg-gray-700 text-white font-normal flex justify-between"
                        >
                          {formik.values.date ? (
                            format(formik.values.date, "PPP")
                          ) : (
                            <span className="text-gray-400">Select a date</span>
                          )}
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formik.values.date || undefined}
                          onSelect={(date) =>
                            formik.setFieldValue("date", date)
                          }
                          disabled={(date) =>
                            date < new Date() || date > addDays(new Date(), 30)
                          }
                          className="bg-white"
                          initialFocus
                          fromDate={new Date()}
                          toDate={addDays(new Date(), 30)}
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.date && formik.errors.date && (
                      <p className="text-red-500 text-sm mt-1 ml-2">
                        {formik.errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="specialInstructions"
                      className="text-gray-100"
                    >
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      placeholder="Any special requirements or instructions for our installation team"
                      value={formik.values.specialInstructions}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full py-3 rounded-lg border-gray-700 bg-gray-800 text-white min-h-32"
                    />
                  </div>

                  <div className="bg-black border rounded-lg p-4 mt-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Installation Summary
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-400">Name:</span>{" "}
                        {formik.values.userName}
                      </p>
                      <p>
                        <span className="text-gray-400">Contact:</span>{" "}
                        {formik.values.mobileNumber}
                      </p>
                      <p>
                        <span className="text-gray-400">Address:</span>{" "}
                        {formik.values.location}, {formik.values.city},{" "}
                        {formik.values.state} - {formik.values.pincode}
                      </p>
                      <p>
                        <span className="text-gray-400">Vehicle:</span>{" "}
                        {formik.values.brand} {formik.values.model} (
                        {formik.values.carModelYear})
                      </p>
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-400">Products:</span>
                        {Object.entries(selectedProducts).length > 0 ? (
                          Object.entries(selectedProducts).map(
                            ([category, products]) => (
                              <div key={category} className="ml-2">
                                <p className="font-semibold text-gray-400">{category}:</p>
                                <p className="text-sm text-white">
                                  {products.map((p) => p.name).join(", ")}
                                </p>
                              </div>
                            )
                          )
                        ) : (
                          <span>None</span>
                        )}
                      </div>

                      <p>
                        <span className="text-gray-400">Date:</span>{" "}
                        {formik.values.date
                          ? format(formik.values.date, "PPP")
                          : "Not selected"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center gap-4 mt-8">
                {currentStep > 0 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white ${
                      currentStep === 0 ? "w-full" : ""
                    } flex items-center gap-1 justify-center`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => formik.handleSubmit()}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-t-white border-2 animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Confirm Installation
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer open={isProductDrawerOpen} onOpenChange={setIsProductDrawerOpen}>
        <DrawerContent className="h-[76vh] text-white bg-[#333] border-none w-full p-0">
          <DrawerHeader className="border-b border-gray-700">
            <DrawerTitle className="text-2xl">
              {productDrawerView === "categories"
                ? "Select a Category"
                : `Select Products from ${
                    categories.find((c) => c.slug === currentCategory)?.name
                  }`}
            </DrawerTitle>
            <div className="flex px-4 justify-between items-center w-full bg-black py-3 mt-2 rounded-xl">
              {Object.values(selectedProducts).flat().length > 0
                ? `${
                    Object.values(selectedProducts).flat().length
                  } Parts Selected`
                : "0 Selected Parts"}
              <Button
                variant={"destructive"}
                onClick={() => setSelectedProducts({})}
              >
                Empty
              </Button>
            </div>
          </DrawerHeader>

          {productDrawerView === "categories" ? (
            <div className="grid grid-cols-2 gap-4 p-4 overflow-y-auto scrollbar-none max-h-[60vh]">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => {
                    setCurrentCategory(category.slug);
                    fetchProducts(category.slug);
                    setProductDrawerView("products");
                  }}
                  className="p-2 cursor-pointer rounded-xl"
                >
                  <Card className="border rounded-xl">
                    <CardContent className="aspect-square relative rounded p-2">
                      <Image
                        src={
                          category.imageUrl || "https://via.placeholder.com/150"
                        }
                        fill
                        alt={category.name}
                        className="object-contain rounded-xl p-4"
                      />
                    </CardContent>
                    <p className="text-center py-2 rounded-xl bg-[#eee] text-black font-medium">
                      {category.name}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 rounded-full border-t-indigo-500 border-2 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  No products available in this category
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[50vh]">
                  {products.map((product) => {
                    const categoryName = categories.find(
                      (c) => c.slug === currentCategory
                    )?.name;
                    const isSelected = selectedProducts[categoryName]?.some(
                      (p) => p.slug === product.slug
                    );
                    return (
                      <div
                        key={product.slug}
                        onClick={() => handleProductSelection(product)}
                        className="p-2 cursor-pointer rounded-xl"
                      >
                        <Card className="border rounded-xl">
                          <CardContent className="aspect-square relative rounded p-2">
                            <Image
                              src={
                                product.images?.[0] ||
                                "https://via.placeholder.com/150"
                              }
                              fill
                              alt={product.name}
                              className="object-contain rounded-xl p-4"
                            />
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="absolute top-2 right-2 w-5 h-5 accent-blue-500"
                            />
                          </CardContent>
                          <p className="text-center py-2 rounded-xl bg-[#eee] text-black font-medium">
                            {product.name}
                          </p>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex justify-between">
                <Button
                  variant={"outline"}
                  onClick={() => setProductDrawerView("categories")}
                >
                  <svg
                    xmlns="https://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back
                </Button>
                <Button
                  className="bg-green-600 text-white"
                  onClick={() => setIsProductDrawerOpen(false)}
                >
                  Confirm Products
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <Drawer open={isBrandDrawerOpen} onOpenChange={setIsBrandDrawerOpen}>
        <DrawerContent className="w-full bg-[#222] border-none h-[70vh]">
          <DrawerHeader className="border-b border-gray-700">
            <DrawerTitle className="text-2xl">Select a Brand</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 grid grid-cols-2 gap-4 h-[60vh] overflow-y-auto scrollbar-none">
            {carsData.map((car) => (
              <div
                key={car.brand}
                onClick={() => {
                  formik.setFieldValue("brand", car.brand);
                  formik.setFieldValue("model", "");
                  formik.setFieldValue("carModelYear", null);
                  setAvailableModels(car.models);
                  setIsBrandDrawerOpen(false);
                }}
                className="cursor-pointer p-4 hover:bg-gray-800 text-gray-100 flex justify-center items-center shadow-lg min-h-20 rounded-xl bg-black transition-colors"
              >
                {car.brand}
              </div>
            ))}
          </div>
          <DrawerFooter className="border-t border-gray-700">
            <Button onClick={() => setIsBrandDrawerOpen(false)}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={isModelDrawerOpen} onOpenChange={setIsModelDrawerOpen}>
        <DrawerContent className="w-full bg-[#222] border-none h-[70vh]">
          <DrawerHeader className="border-b border-gray-700">
            <DrawerTitle className="text-2xl">Select a Model</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 grid grid-cols-2 gap-4 h-[60vh] overflow-y-auto scrollbar-none">
            {availableModels.map((model) => (
              <div
                key={model}
                onClick={() => {
                  formik.setFieldValue("model", model);
                  formik.setFieldValue("carModelYear", null);
                  setIsModelDrawerOpen(false);
                }}
                className="cursor-pointer p-4 hover:bg-gray-800 text-gray-100 flex justify-center items-center shadow-lg min-h-20 rounded-xl bg-black transition-colors"
              >
                {model}
              </div>
            ))}
          </div>
          <DrawerFooter className="border-t border-gray-700">
            <Button onClick={() => setIsModelDrawerOpen(false)}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={isYearDrawerOpen} onOpenChange={setIsYearDrawerOpen}>
        <DrawerContent className="w-full bg-[#222] border-none h-[70vh]">
          <DrawerHeader className="border-b border-gray-700">
            <DrawerTitle className="text-2xl">Select a Year</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 grid grid-cols-3 gap-4 h-[60vh] overflow-y-auto scrollbar-none">
            {years.map((year) => (
              <div
                key={year}
                onClick={() => {
                  formik.setFieldValue("carModelYear", year);
                  setIsYearDrawerOpen(false);
                }}
                className="cursor-pointer p-4 hover:bg-gray-800 text-gray-100 flex justify-center items-center shadow-lg min-h-20 rounded-xl bg-black transition-colors"
              >
                {year}
              </div>
            ))}
          </div>
          <DrawerFooter className="border-t border-gray-700">
            <Button onClick={() => setIsYearDrawerOpen(false)}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default InstallationPage;
