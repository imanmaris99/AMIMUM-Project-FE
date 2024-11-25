import React from "react";
import { HeaderRegister, RegisterForm } from "@/app/components";

const Register = () => {
  return (
    <div className="bg-[url('/bg-image.png')] bg-cover  w-full h-full">
      <HeaderRegister />
      <RegisterForm />
    </div>
  );
};

export default Register;
