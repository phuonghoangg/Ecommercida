"use client";

import { GlobalContext } from "@/context";
import { addToCart } from "@/services/cart";
import { useContext } from "react";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/ComponentLevel";
import Notification from "../Loader/Notifycation";

function CommonDetails({ item }) {
  const {
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    setShowCartModal,
  } = useContext(GlobalContext);

  const handleAddToCartItem = async (item) => {
    setComponentLevelLoader({ loading: true, id: item._id });
    const formData = { productID: item._id, userID: user._id };
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
  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:col-gap-12 xl:col-gap-16 mt-8 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3 lg:row-end-1 ">
            <div className="lg:flex lg:items-start ">
              <div className="lg:order-2 lg:ml-5">
                <div className="max-w-xl overflow-hidden rounded-lg ">
                  <img
                    src={item.imageUrl}
                    className="h-full w-full max-w-full object-cover"
                    alt="product details"
                  />
                </div>
              </div>
              <div className="mt-5 w-full lg:order-1 lg:w-32 lg:flex-shrink-0  ">
                <div className="flex flex-row items-start lg:flex-col">
                  <button
                    type="button"
                    className="flex-0 aspect-square  mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center "
                  >
                    <img
                      src={item.imageUrl}
                      className="h-full w-full object-cover"
                      alt="Product Details"
                    />
                  </button>
                  <button
                    type="button"
                    className="flex-0 aspect-square  mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center "
                  >
                    <img
                      src={item.imageUrl}
                      className="h-full w-full object-cover"
                      alt="Product Details"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <h1 className="sm:text-2xl font-bold text-gray-900 ">
              {item && item.name}
            </h1>
            <div className="mt-10 flex flex-col items-center justify-between space-y-8 border-t border-b py-4 sm:flex-row sm:space-y-0 ">
              <div className="flex items-end ">
                <h1
                  className={`text-3xl font-bold mr-2 ${
                    item.onSale === "yes" ? "line-through text-xl" : ""
                  }`}
                >
                  ${item && item.price}
                </h1>
                {item.onSale === "yes" ? (
                  <h1 className="mr-3 text-3xl font-bold text-red-700">
                    {`$ ${(
                      item.price -
                      item.price * (item.priceDrop / 100)
                    ).toFixed(2)}`}
                  </h1>
                ) : null}
              </div>
              <button
                onClick={() => handleAddToCartItem(item)}
                className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium tracking-wide uppercase text-white "
              >
                {componentLevelLoader && componentLevelLoader.loading ? (
                  <ComponentLevelLoader
                    color={"#fff"}
                    loading={
                      componentLevelLoader && componentLevelLoader.loading
                    }
                    text={"Adding to cart"}
                  />
                ) : (
                  "Add to cart"
                )}
              </button>
            </div>
            <ul className="mt-8 space-y-2">
              <li className="flex items-center text-left text-sm font-medium text-gray-600 ">
                {item && item.deliveryInfo}
              </li>
              <li className="flex items-center text-left text-sm font-medium text-gray-600 ">
                {"Cancel anytime"}
              </li>
            </ul>
            <div className="lg:col-span-3">
              <div className="border-b border-gray-400 ">
                <nav className="flex gap-4">
                  <a
                    href="#"
                    className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900"
                  >
                    Description
                  </a>
                </nav>
              </div>
              <div className="mt-8 flow-root sm:mt-12">
                {item && item.description}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}

export default CommonDetails;
