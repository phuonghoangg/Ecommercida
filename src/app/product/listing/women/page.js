import CommonListing from "@/components/CommonListing";
import { getAllAdminProduct, productByCategory } from "@/services/product";

async function AllMenProducts() {
  const getAllProducts = await productByCategory('women');

  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}

export default AllMenProducts;
