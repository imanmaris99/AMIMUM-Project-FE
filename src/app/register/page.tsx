import React from "react";
import { HeaderRegister, RegisterForm } from "../components";

const Register = () => {
  return (
    <div className="bg-[url('/bg-image.png')] bg-cover  w-full h-full">
      <HeaderRegister />
      <RegisterForm />
    </div>
  );
};

export default Register;
