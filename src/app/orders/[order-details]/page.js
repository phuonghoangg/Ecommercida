"use client";

import { GlobalContext } from "@/context";
import { getOrderDetails } from "@/services/order";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

function OrderDetails() {
  const {
    user,
    pageLevelLoader,
    setPageLevelLoader,
    allOrdersForUser,
    setAllOrdersForUser,
    orderDetail,
    setOrderDetails,
  } = useContext(GlobalContext);

  const params = useParams();

  const extractOrderDetails = async () => {
    setPageLevelLoader(true);
    const res = await getOrderDetails(params["order-details"]);

    if (res.success) {
      setPageLevelLoader(false);
      setOrderDetails(res.data);
    } else {
      setPageLevelLoader(false);
    }
  };

  useEffect(() => {
    extractOrderDetails();
  }, []);

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color="#000"
          loading={pageLevelLoader}
          size={15}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <section className="py-14 px-4 md:px-6">
      <div className="flex flex-col justify-start items-start space-y-2 ">
        <h1 className="text-3xl lg:text-4xl font-bold leading-7 lg:leading-9 text-gray-900">
          Order #{orderDetail && orderDetail._id}
        </h1>
        <p className="text-base font-medium leading-6 text-gray-600">
          {orderDetail &&
            orderDetail.createdAt &&
            orderDetail.createdAt.split("T")[1].split(".")[0]}
        </p>
      </div>
      <div className="flex flex-col mt-10 justify-center xl:flex-row items-stretch w-full xl:space-x-8 md:space-y-6 xl:space-y-0  ">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <div className="flex flex-col items-start justify-start bg-gray-50 px-4 py-4 md:p-6 xl:p-8 w-full ">
            <p className="font-bold text-lg "> Your Order summary</p>
            {orderDetail &&
            orderDetail.orderItems &&
            orderDetail.orderItems.length
              ? orderDetail.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
                  >
                    <div className="pb-4 md:pb-8 w-full md:w-40">
                      <img
                        src={item && item.product && item.product.imageUrl}
                        alt="image url"
                        className="w-full hidden md:block"
                      />
                    </div>
                    <div className="border-b border-gray-300 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                      <div className="w-full flex flex-col justify-start items-start space-y-8 ">
                        <h3 className="text-xl font-semibold leading-6 text-gray-900">
                          {item && item.product && item.product.name}
                        </h3>
                      </div>
                      <div className="w-full flex justify-end items-start space-x-8 ">
                        <h3 className="text-xl font-semibold leading-6 text-gray-900">
                          ${item && item.product && item.product.price}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-x-5 xl:space-x-8">
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Summary
              </h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between w-full">
                  <p className="text-base leading-5 text-gray-800">Subtotal</p>
                  <p className="text-base leading-5 text-gray-900">
                    ${orderDetail && orderDetail.totalPrice}
                  </p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-base leading-5 text-gray-800">Shipping</p>
                  <p className="text-base leading-5 text-gray-900">Free</p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-base leading-5 text-gray-800">Subtotal</p>
                  <p className="text-base leading-5 text-gray-900">
                    ${orderDetail && orderDetail.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-50 w-full xl:w-96 justify-between items-center md:items-start px-4 py-6 flex-col">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Cstomer Details
            </h3>
            <div className="flex flex-col justify-start items-start flex-shrink-0 ">
              <div className="flex gap-4 flex-col justify-center w-full md:justify-start items-start  py-8 border-b border-gray-200">
                <p className="text-base font-semibold leading-4 text-left  text-gray-900">
                  Name: {user?.name}
                </p>
                <p className="text-base font-semibold leading-4 text-left  text-gray-900">
                  Email: {user?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-8 lg:space-x-8  xl:space-x-0 space-y-4 md:space-y-0 xl:space-y-12 md:flex-row items-center md:items-start  ">
              <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                <p>Shipping Address</p>
                <p>
                  Address: {orderDetail && orderDetail.shippingAddress.address}
                </p>
                <p>City: {orderDetail && orderDetail.shippingAddress.city}</p>
                <p>
                  Country: {orderDetail && orderDetail.shippingAddress.country}
                </p>
                <p>
                  Postal Code:{" "}
                  {orderDetail && orderDetail.shippingAddress.postalCode}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                //   router.push(`/orders/${item._id}`);
              }}
              className="mt-5 mr-5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
            >
              View Order Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetails;
