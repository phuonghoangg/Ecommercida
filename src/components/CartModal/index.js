"use client";

import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItem } from "@/services/cart";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/ComponentLevel";
import { useRouter } from "next/navigation";

function CartModal() {
  const {
    showCartModal,
    setShowCartModal,
    user,
    cartItems,
    setCartItems,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  const extractAllCartItems = async () => {
    const res = await getAllCartItem(user._id);
    if (res.success) {
      setCartItems(res.data);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    } else {
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
    if (user !== null) extractAllCartItems();
  }, [user]);
  return (
    <CommonModal
      show={showCartModal}
      setShow={setShowCartModal}
      showButton={true}
      mainContent={
        cartItems && cartItems.length ? (
          <ul role="list" className="-my-6 divide-y divide-gray-300">
            {cartItems?.map((cartItem) => (
              <li key={cartItem._id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={
                      cartItem &&
                      cartItem.productID &&
                      cartItem.productID.imageUrl
                    }
                    className="h-full w-full object-cover object-center"
                    alt="Image product"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col ">
                  <div>
                    <div className="flex flex-col text-base font-medium text-gray-900 ">
                      <h3>
                        <a>
                          {cartItem &&
                            cartItem.productID &&
                            cartItem.productID.name}
                        </a>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      $
                      {cartItem &&
                        cartItem.productID &&
                        cartItem.productID.price}
                    </p>
                  </div>
                  <div className="flex flex-1 justify-between items-end text-sm">
                    <button
                      onClick={() => handleDeleteCartItem(cartItem._id)}
                      type="button"
                      className="font-medium text-yellow-600 sm:order-2"
                    >
                      {componentLevelLoader &&
                      componentLevelLoader.loading &&
                      componentLevelLoader.id === cartItem._id ? (
                        <ComponentLevelLoader
                          color={"#fff"}
                          text={"Removing.."}
                          loading={
                            componentLevelLoader && componentLevelLoader.loading
                          }
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null
      }
      buttonComponent={
        <Fragment>
          <button
            onClick={() => {
              router.push("/cart");
              setShowCartModal(false);
            }}
            type="button"
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
          >
            Go to Cart
          </button>
          <button
            onClick={() => {
              router.push("/checkout");
              setShowCartModal(false);
            }}
            disabled={cartItems && cartItems.length === 0}
            type="button"
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
          >
            Checkout
          </button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
            <button type="button" className="font-medium text-gray-400">
              Continute Shopping<span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </Fragment>
      }
    />
  );
}

export default CartModal;
