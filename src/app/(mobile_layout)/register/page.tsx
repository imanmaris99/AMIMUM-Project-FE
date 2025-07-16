import React from "react";
import { HeaderRegister, RegisterForm } from "@/components";

const RegisterFormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-10 animate-pulse">
    <div className="h-6 w-1/2 bg-gray-300 rounded mb-4" />
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-full bg-gray-300 rounded" />
      ))}
    </div>
    <div className="h-10 w-full bg-gray-300 rounded mt-6" />
  </div>
);

const Register = () => {
  return (
    <div className="bg-[url('/bg-image.png')] bg-cover  w-full h-full">
      <HeaderRegister />
      <RegisterForm />
    </div>
  );
};

export default Register;
