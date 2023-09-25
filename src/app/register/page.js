"use client";

import InputComponent from "@/components/FormElement/InputComponent";
import SelectComponent from "@/components/FormElement/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/ComponentLevel";
import Notification from "@/components/Loader/Notifycation";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { registrationFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const isRegister = false;

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};
function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  const {
    isAuthUser,
    setIsAuthUser,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);
  const isFormValid = () => {
    return formData &&
      formData.name &&
      formData.name.trim() !== "" &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  };

  const handleRegisterOnSubmit = async () => {
    setComponentLevelLoader({ loading: true, id: "" });
    const data = await registerNewUser(formData);
    if (data.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.push("/login");
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  

  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  }, [isAuthUser]);
  return (
    <div className="bg-white relative ">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row ">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row ">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                {isRegister
                  ? "Registration Successfully"
                  : "Sign up for account"}
              </p>
              {isRegister ? (
                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide  "
                >
                  Login
                </button>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8 ">
                  {registrationFormControls.map((controlItem) =>
                    controlItem.componentType === "input" ? (
                      <InputComponent
                        label={controlItem.label}
                        placeholder={controlItem.placeholder}
                        type={controlItem.type}
                        key={controlItem.id}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: e.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
                      />
                    ) : controlItem.componentType === "select" ? (
                      <SelectComponent
                        key={controlItem.id}
                        label={controlItem.label}
                        options={controlItem.options}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: e.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
                      />
                    ) : null
                  )}
                  <button
                    className=" disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide  "
                    disabled={!isFormValid()}
                    onClick={handleRegisterOnSubmit}
                  >
                    {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      color={"#ffff"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                      text={"Registingg"}
                    />
                  ) : (
                    "Register"
                  )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default Register;
