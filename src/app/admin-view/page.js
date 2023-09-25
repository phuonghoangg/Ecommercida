"use client";

import ComponentLevelLoader from "@/components/Loader/ComponentLevel";
import Notification from "@/components/Loader/Notifycation";
import { GlobalContext } from "@/context";
import { getAllOrdersForAllUsers, updateStatusOfOrder } from "@/services/order";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

function AdminView() {
  const {
    allOrderForAllUser,
    setAllOrderForAllUser,
    pageLevelLoader,
    setPageLevelLoader,
    user,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const extractAllOrderForAllUser = async () => {
    const res = await getAllOrdersForAllUsers();

    if (res.success) {
      setPageLevelLoader(false);
      setAllOrderForAllUser(
        res.data && res.data.length
          ? res.data.filter((item) => item.user._id !== user._id)
          : []
      );
    } else {
      setPageLevelLoader(false);
    }
  };
  const handleUpdateOrderStatus = async (item) => {
    setComponentLevelLoader({ loading: true, id: item._id });
    const res = await updateStatusOfOrder({
      ...item,
      isProcessing: false,
    });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllOrderForAllUser();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  useEffect(() => {
    setPageLevelLoader(true);
    if (user !== null) extractAllOrderForAllUser();
  }, [user]);

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
    <section>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="">
          <div className="px-4 py-6 sm:px-8 sm:py-10">
            <div className="flow-root">
              {allOrderForAllUser && allOrderForAllUser.length ? (
                <ul className="flex flex-col gap-4">
                  {allOrderForAllUser.map((item) => (
                    <li
                      key={item._id}
                      className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left "
                    >
                      <div className="flex ">
                        <h1 className="font-bold text-lg mb-3 flex-1 ">
                          #order: {item._id}
                        </h1>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              User Name:
                            </p>
                            <p className="mr-3 text-sm font-semibold text-gray-900">
                              ${item?.user?.name}
                            </p>
                          </div>
                          <div className="flex gap-3 items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              User Email:
                            </p>
                            <p className="mr-3 text-sm font-semibold text-gray-900">
                              ${item?.user?.email}
                            </p>
                          </div>
                          <div className="flex gap-3 items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              Total Paid Amount :
                            </p>
                            <p className="mr-3 text-sm font-semibold text-gray-900">
                              ${item?.totalPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.orderItems.map((orderItem, index) => (
                          <div key={index} className="shrink-0">
                            <img
                              src={
                                orderItem &&
                                orderItem.product &&
                                orderItem.product.imageUrl
                              }
                              alt="image url"
                              className="h-24 w-24 max-w-full rounded-lg object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-5">
                        <button
                          onClick={() => {}}
                          className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
                        >
                          {item.isProcessing
                            ? "Order is processing"
                            : "Order is delivery"}
                        </button>
                        <button
                          onClick={() => {
                            handleUpdateOrderStatus(item);
                          }}
                          disabled={!item.isProcessing}
                          className=" mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              color={"#fff"}
                              loading={
                                componentLevelLoader &&
                                componentLevelLoader.loading
                              }
                              text={"updating status"}
                            />
                          ) : (
                            "Update Order Status"
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}

export default AdminView;
