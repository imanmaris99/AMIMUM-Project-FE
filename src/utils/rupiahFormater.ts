const rupiahFormater = (number: number) => {
  const format = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

  return format;
};

export default rupiahFormater;
