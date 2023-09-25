"use client";

import { GlobalContext } from "@/context";
import { getAllAddress } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

function Checkout() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkoutFormData,
    setCheckoutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const publishableKey =
    "pk_test_51NtTG8IqyERJ3WNsfgEFARJleArgKvW7pkuWwz9h5xTfv3tIP4RjeRegAaP36uKfVT58Snt9WPPMBlOzLUSERdSP00EKmeIo77";
  const stripePromise = loadStripe(publishableKey);

  const getAllAddressUser = async () => {
    const res = await getAllAddress(user?._id);
    if (res.success) {
      setAddresses(res.data);
    }
  };

  const handleSelectedAddress = (item) => {
    if (item._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckoutFormData({
        ...checkoutFormData,
        shippingAddress: {},
      });

      return;
    }
    setSelectedAddress(item._id);
    setCheckoutFormData({
      ...checkoutFormData,
      shippingAddress: {
        ...checkoutFormData.shippingAddress,
        fullName: item.fullName,
        city: item.city,
        country: item.country,
        postalCode: item.postalCode,
        address: item.address,
      },
    });
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: [item.productID.imageUrl],
          name: item.productID.name,
        },
        unit_amount: item.productID.price * 100,
      },
      quantity: 1,
    }));
    const res = await callStripeSession(createLineItems);
    //successs
    setIsOrderProcessing(true);
    localStorage.setItem("stripe", true),
      localStorage.setItem(
        "checkoutFormData",
        JSON.stringify(checkoutFormData)
      );
    console.log(res);
    const { error } = await stripe.redirectToCheckout({
      sessionId: res.id,
    });

    console.log(error);
  };

  useEffect(() => {
    const createFinalOrder = async () => {
      const isStripe = JSON.parse(localStorage.getItem("stripe"));
      if (
        isStripe &&
        params.get("status") === "success" &&
        cartItems &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const getOrderCheckoutFormData = JSON.parse(
          localStorage.getItem("checkoutFormData")
        );

        const createFinalCheckoutFormData = {
          user: user?._id,
          shippingAddress: getOrderCheckoutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod: "Stripe",
          totalPrice: cartItems.reduce(
            (total, item) => item.productID.price + total,
            0
          ),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };
        console.log("createFinalCheckoutFormData", createFinalCheckoutFormData);
        const res = await createNewOrder(createFinalCheckoutFormData);
        if (res.success) {
          setIsOrderProcessing(false);
          setOrderSuccess(true);
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          localStorage.setItem("cartItems", JSON.stringify([]));
          localStorage.setItem("stripe", false);
        } else {
          setIsOrderProcessing(false);
          setOrderSuccess(false);
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    };
    createFinalOrder();
  }, [params.get("status"), cartItems]);

  useEffect(() => {
    if (user !== null) getAllAddressUser();
  }, [user]);

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        // setOrderSuccess(false);
        router.push("/orders");
      }, [2000]);
    }
  }, [orderSuccess]);

  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex  justify-center items-center ">
        <PulseLoader
          color={"#000"}
          loading={isOrderProcessing}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
            <div className="bg-white shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg">
                  Your payment is successfull and you will be redirected to
                  orders page in 2 seconds !
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8 ">
          <p className="font-medium text-xl ">Cart summary</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
            {cartItems && cartItems.length ? (
              cartItems.map((item) => (
                <div
                  onClick={() => {}}
                  key={item._id}
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                >
                  <div className="m-2 h-24 w-32 rounded-md border overflow-hidden shrink-0">
                    <img
                      src={item && item.productID && item.productID.imageUrl}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col w-full px-4 py-4 ">
                    <span className="font-bold">
                      {item && item.productID && item.productID.name}
                    </span>
                    <span className="font-semibold">
                      {item && item.productID && item.productID.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>Your cart is empty</div>
            )}
          </div>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8  lg:mt-0">
          <p className="text-xl font-medium">Shipping address details</p>
          <p className="text-gray-400 font-bold">
            Complete your order by selecting address below
          </p>
          <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
            {addresses && addresses.length ? (
              addresses.map((item) => (
                <div
                  onClick={() => handleSelectedAddress(item)}
                  key={item._id}
                  className={`border p-6 ${
                    item._id === selectedAddress ? "border-red-900" : ""
                  }`}
                >
                  <p className="">Name: {item.fullName}</p>
                  <p className="">Address:{item.address} </p>
                  <p className="">City:{item.city} </p>
                  <p className="">Country:{item.country} </p>
                  <p className="">PostalCode:{item.postalCode} </p>
                  <button
                    onClick={() => {}}
                    className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
                  >
                    {item._id === selectedAddress
                      ? "Selected Address"
                      : "Select Address"}
                  </button>
                </div>
              ))
            ) : (
              <p>No addresses added</p>
            )}
          </div>
          <button
            onClick={() => {
              router.push("/account");
            }}
            className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
          >
            Add new address
          </button>
          <div className="mt-6 border-t border-b py-2 ">
            <div className="flex items-center justify-between ">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="text-sm font-bold text-gray-900">
                $
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item.productID.price + total,
                      0
                    )
                  : "0"}
              </p>
            </div>
            <div className="flex items-center justify-between ">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="text-sm font-bold text-gray-900">Free</p>
            </div>
            <div className="flex items-center justify-between ">
              <p className="text-sm font-medium text-gray-900">total</p>
              <p className="text-sm font-bold text-gray-900">
                $
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item.productID.price + total,
                      0
                    )
                  : "0"}
              </p>
            </div>
            <div className="pb-10">
              <button
                onClick={handleCheckout}
                disabled={
                  (cartItems && cartItems.length === 0) ||
                  Object.keys(checkoutFormData.shippingAddress).length === 0
                }
                className="mt-5 mr-5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
