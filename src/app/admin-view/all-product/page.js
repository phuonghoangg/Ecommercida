import CommonListing from "@/components/CommonListing";
import { getAllAdminProduct } from "@/services/product";

async function AdminAllViewProduct() {
  
  const allAdminProduct = await getAllAdminProduct();

  return <CommonListing data = {allAdminProduct && allAdminProduct.data} />;
}

export default AdminAllViewProduct;
