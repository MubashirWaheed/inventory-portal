import { record } from "zod";

export const mergeStockData = (
  openingQuantity: any,
  currentQuantityOfProducts: any,
  addedSumForProduct: any,
  issuedSumForProduct: any,
) => {
  console.log(
    "LOG FROM THE FUNCTION:",
    openingQuantity,
    currentQuantityOfProducts,
    addedSumForProduct,
    issuedSumForProduct,
  );

  return currentQuantityOfProducts.map((product: any) => {
    const matchingOpeningProduct = openingQuantity.find(
      (openingRecord: any) => openingRecord.productId == product.id,
    );
    const addSumOfProduct = addedSumForProduct.find(
      (record: any) => record.id == product.id,
    );
    const issuedRecord = issuedSumForProduct.find(
      (item: any) => item.id == product.id,
    );
    return {
      id: product.id,
      itemCode: product.itemCode,
      openingQuantity: matchingOpeningProduct?.quantity || "not available",
      currentQuantity: product.quantity,
      issuedQuantity: issuedRecord?.quantity || 0,
      addedQuantity: addSumOfProduct?.quantity || 0,
    };
  });

  return [];
};
