import { AccordionExpandDefault } from "@/app/components";

const FAQ = () => {
  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">FAQ</h6>
      </div>

      <div className="mx-6 mt-6 flex flex-col gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <AccordionExpandDefault
            key={index}
            title="Tentang aplikasi AmImUm herbal"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
          />
        ))}
      </div>

      <div className="mx-6 mt-6 flex justify-center items-center">
        <p className="text-sm">
          ©2024 <span className="text-gray-500">by</span>{" "}
          <span className="font-bold text-primary">AmImUm Team</span>.
        </p>
      </div>
    </>
  );
};

export default FAQ;
