// TODO rubah jadi Rupiah
export const formatPrice = (price: number) => {
  return Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// export const formatPrice = (price: number) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0, // Menetapkan jumlah minimum digit desimal menjadi 0
//     maximumFractionDigits: 0, // Menetapkan jumlah maksimum digit desimal menjadi 0
//   }).format(price);
// };

// const price = 1_000_000;
// console.log(formatPrice(price)); // Output: Rp1.000.000,00