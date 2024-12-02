import { FiPackage, FiLayers, FiAlertCircle } from "react-icons/fi";

const ProductInformation = () => {
  return (
    <div className="mt-2 mx-4">
      <div className="space-y-2 text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <FiPackage className="text-gray-500" />
          <span>Isi: 11 sachet | 6 gram/sachet</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiLayers className="text-gray-500" />
          <span>Stock: 15 pack</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="text-gray-500" />
          <span>Baik dikonsumsi hingga 23 December 2024</span>
        </div>
      </div>
      <hr className="mt-4" />
    </div>
  );
};

export default ProductInformation;
