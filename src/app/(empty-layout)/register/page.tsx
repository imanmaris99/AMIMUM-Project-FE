import HeaderRegister from "@/components/register/HeaderRegister";
import RegisterForm from "@/components/register/RegisterForm";

const Register = () => {
  return (
    <div className="bg-[url('/bg-image.png')] bg-cover w-full h-full">
      <HeaderRegister />
      <RegisterForm />
    </div>
  );
};

export default Register;
