"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useContextData } from "@/ContextData/ContextDatastore";
import api from "@/lib/api";
import { ifError } from "assert";
import { FaFacebookF } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { apiClient } from "@/utils/helper";


type Admin = {
    username: string;
    password: string;
};

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showpass, setShowpass] = useState("password");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { setUser, setCheck, check } = useContextData();

    const navigate = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Login form submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // const response = await api.post("/auth/login", formData); // Interceptor adds CSRF header

            // const response = await api.post("http://localhost:3000/auth/login", formData); // Interceptor adds CSRF header
            const response = await apiClient<Admin[]>('https://147.93.107.197:3542/admin/login', { method: 'POST', body: { ...formData } });

            console.log("Login Response: ", response);

            if (response.message === "Login successful") {
                await new Promise((resolve) => setTimeout(resolve, 500));
                setUser(response.admin.username);
                setCheck(!check);
                toast.success("Logged in successfully!");
                if (response.admin.role === "ADMIN" || response.admin.role === "SUPER_ADMIN") {
                    navigate.push("/admin/dashboard");
                } else {
                    navigate.push("/");
                    console.log("your are in")
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("Please Enter Correct Username Password!");

            // setError(
            //   err?.response?.data?.message || "Login failed. Please try again."
            // );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh flex justify-center gap-4 flex-col items-center px-4 bg-[url(/loginbg.jpeg)]">
            <div className="mx-10 my-5 w-full max-w-md bg-black py-12 flex flex-col items-center gap-4 p-8 rounded-lg shadow-lg border border-zinc-800">
                <form
                    className="w-full max-w-md  pt-12 flex flex-col items-center gap-4   border-zinc-800"
                    onSubmit={handleSubmit}

                >
                    <h1 className="text-2xl font-light flex justify-start text-gray-100 pb-4">
                        Admin Login
                    </h1>
                    <Input
                        type="text"
                        name="username"
                        placeholder="User Name"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <div className="w-full relative">
                        <Input
                            type={showpass}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="absolute top-[6px] right-2">
                            {showpass === "text" ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                    onClick={() => setShowpass("password")}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                    onClick={() => setShowpass("text")}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <Button
                        type="submit"
                        className="bg-white text-black w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-black animate-spin"></div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>
                {/* <p>Login With Phone number</p> */}


                {/* <p className=" text-gray-500">
                    or
                </p> */}

                {/* <div className="flex gap-4 w-full">
                    <Button className=" bg-white text-black w-full  "><FaFacebookF size='1.5rem' /></Button>
                    <Button className=" bg-white text-black w-full "><FcGoogle size='1.5rem' /></Button>
                </div> */}

                {/* <div className="flex justify-around gap-4 w-full "> */}
                {/* <p> */}
                {/* forgot password?{" "} */}
                {/* <span
                             onClick={() => { }} 
                         className="underline w-full text-center pr-4"
                        > 
                            Forgot password?
                        </span> */}
                {/* </p> */}
                {/* <p> */}
                {/* Don't have account?{" "} */}
                {/* <span
                            onClick={() => navigate.push("/auth/register")}
                            className="underline w-full text-center pr-4"
                        >
                            Register
                        </span> */}
                {/* </p> */}
                {/* </div> */}

                {/* <p>
          Don't have any account?{" "}
          <span
            onClick={() => navigate.push("/auth/register")}
            className="underline"
          >
            Register
          </span>
        </p> */}

            </div>

        </div>
    );
};

export default AdminLoginPage;
