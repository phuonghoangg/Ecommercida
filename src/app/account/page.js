"use client";

import InputComponent from "@/components/FormElement/InputComponent";
import ComponentLevelLoader from "@/components/Loader/ComponentLevel";
import Notification from "@/components/Loader/Notifycation";
import { GlobalContext } from "@/context";
import {
  AddNewAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "@/services/address";
import { addNewAddressFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

function Account() {
  const {
    user,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    componentLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentEditAddressId, setCurrentEditAddressId] = useState(null);

  const router = useRouter();

  const extractAllAddress = async () => {
    const res = await getAllAddress(user?._id);
    if (res.success) {
      setAddresses(res.data);
      setPageLevelLoader(false);
      setCurrentEditAddressId(null);
    }
  };

  const handleAddOrUpdateAddress = async () => {
    setComponentLevelLoader({ loading: true, id: "" });

    const res =
      currentEditAddressId !== null
        ? await updateAddress({ ...addressFormData, _id: currentEditAddressId })
        : await AddNewAddress({ ...addressFormData, userID: user?._id });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
      setCurrentEditAddressId(null);
      setComponentLevelLoader({ loading: false, id: "" });
      extractAllAddress();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setCurrentEditAddressId(null);
    }
  };

  const handleUpdateAddress = async (item) => {
    setShowAddressForm(true);
    setAddressFormData({
      fullName: item.fullName,
      city: item.city,
      country: item.country,
      postalCode: item.postalCode,
      address: item.address,
    });
    setCurrentEditAddressId(item._id);
  };

  const handleDeleteAddress = async (id) => {
    setComponentLevelLoader({ loading: true, id: id });

    const res = await deleteAddress(id);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllAddress();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllAddress();
    }
  };

  useEffect(() => {
    if (user !== null) extractAllAddress();
  }, [user]);
  return (
    <section className="mx-auto py-6 bg-gray-100 px-4 sm:mx-0 sm:px-6 lg:px-8">
      <div className="bg-white shadow ">
        <div className="p-6 sm:p-12 ">
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
            {/* render image user */}
          </div>
          <div className="flex flex-col flex-1">
            <h4 className="text-lg font-semibold text-center md:text-left">
              {user?.name}
            </h4>
            <p>{user?.email}</p>
            <p>{user?.role}</p>
          </div>
          <button
            onClick={() => {router.push('/orders')}}
            className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
          >
            View Your Orders
          </button>
          <div className="mt-6">
            <h1 className="font-bold text-lg">Your Address</h1>
            {pageLevelLoader ? (
              <PulseLoader
                color="#000"
                loading={pageLevelLoader}
                size={15}
                data-testid="loader"
              />
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                {addresses && addresses.length ? (
                  addresses.map((item) => (
                    <div key={item._id} className="border p-6">
                      <p className="">Name: {item.fullName}</p>
                      <p className="">Address:{item.address} </p>
                      <p className="">City:{item.city} </p>
                      <p className="">Country:{item.country} </p>
                      <p className="">PostalCode:{item.postalCode} </p>
                      <button
                        onClick={() => {
                          handleUpdateAddress(item);
                        }}
                        className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteAddress(item._id);
                        }}
                        className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
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
                            text={"Deleting.."}
                          />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No addresses found ! Pls add a new address below</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setShowAddressForm(!showAddressForm);
              }}
              className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
            >
              {showAddressForm ? "Close Add address" : " Add new address"}
            </button>
          </div>
          {showAddressForm ? (
            <div className="flex flex-col mt-5 justify-center pt-4 items-center">
              <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                {addNewAddressFormControls.map((controlItem) => (
                  <InputComponent
                    key={controlItem.id}
                    label={controlItem.label}
                    placeholder={controlItem.placeholder}
                    type={controlItem.type}
                    value={addressFormData[controlItem.id]}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        [controlItem.id]: e.target.value,
                      })
                    }
                  />
                ))}
              </div>
              <button
                onClick={handleAddOrUpdateAddress}
                className="mt-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
              >
                {componentLevelLoader && componentLevelLoader.loading ? (
                  <ComponentLevelLoader
                    color={"#fff"}
                    loading={
                      componentLevelLoader && componentLevelLoader.loading
                    }
                    text={currentEditAddressId !== null ? "Updating" : "Saving"}
                  />
                ) : currentEditAddressId !== null ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <Notification />
    </section>
  );
}

export default Account;
