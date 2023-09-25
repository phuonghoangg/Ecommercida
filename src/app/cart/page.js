"use client";

import CommonCart from "@/components/CommonCart";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItem } from "@/services/cart";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

function Cart() {
  const {
    user,
    cartItems,
    setCartItems,
    pageLevelLoader,
    setPageLevelLoader,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  const extractAllCartItems = async () => {
    const res = await getAllCartItem(user._id);
    if (res.success) {
      setCartItems(res.data);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    }
  };

  const handleDeleteCartItem = async (id) => {
    setComponentLevelLoader({ loading: true, id: id });
    const res = await deleteFromCart(id);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllCartItems();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    setPageLevelLoader(true);
  }, []);
  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);
  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex  justify-center items-center ">
        <PulseLoader
          color={"#000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }
  return (
    <CommonCart
      handleDeleteCartItem={handleDeleteCartItem}
      cartItems={cartItems}
      componentLevelLoader={componentLevelLoader}
    />
  );
}

export default Cart;
