"use client";

import ComponentLevelLoader from "@/components/Loader/ComponentLevel";
import { GlobalContext } from "@/context";
import { addToCart } from "@/services/cart";
import { deleteProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

const styleButton = {
  button:
    "mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white ",
};

function ProductButton({ item }) {
  const pathName = usePathname();
  const {
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);

  const router = useRouter();

  const isAdminView = pathName.includes("admin-view");

  const handleDeleteProduct = async (item) => {
    setComponentLevelLoader({ loading: true, id: item._id });
    const res = await deleteProduct(item);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleAddToCart = async (getItem) => {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const formData = { productID: getItem._id, userID: user._id };
    const res = await addToCart(formData);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCartModal(true);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCartModal(true);
    }
  };
  return isAdminView ? (
    <>
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product");
        }}
        className={styleButton.button}
      >
        update
      </button>
      <button
        onClick={() => handleDeleteProduct(item)}
        className={styleButton.button}
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={"Deleting Product"}
            color={"#fff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "Delete"
        )}
      </button>
    </>
  ) : (
    <button
      onClick={() => {
        handleAddToCart(item);
      }}
      className={styleButton.button}
    >
      {componentLevelLoader &&
      componentLevelLoader.loading &&
      item._id === componentLevelLoader.id ? (
        <ComponentLevelLoader
          text={"Adding to cart"}
          color={"#fff"}
          loading={componentLevelLoader && componentLevelLoader.loading}
        />
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}

export default ProductButton;
