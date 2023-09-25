"use client";

import InputComponent from "@/components/FormElement/InputComponent";
import ComponentLevelLoader from "@/components/Loader/ComponentLevel";
import Notification from "@/components/Loader/Notifycation";
import { GlobalContext } from "@/context";
import { login } from "@/services/login";
import { loginFormControls, registrationFormControls } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const isRegister = false;

const initialFormData = {
  email: "",
  password: "",
};

function Login() {
  const [formData, setFormData] = useState(initialFormData);

  const {
    user,
    setUser,
    isAuthUser,
    setIsAuthUser,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  // console.log(formData);
  const router = useRouter();

  const isFormValid = () => {
    return formData &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  };

  const handleLogin = async () => {
    setComponentLevelLoader({ loading: true, id: "" });

    const data = await login(formData);
    // console.log(data);
    if (data?.success) {
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setIsAuthUser(true);
      setUser(data?.finalData?.user);
      setFormData(initialFormData);
      Cookies.set("token", data?.finalData?.token);
      localStorage.setItem("user", JSON.stringify(data?.finalData?.user));
    } else {
      toast.error(data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsAuthUser(false);
      setComponentLevelLoader({ loading: false, id: "" });
    }
  };
  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  },[isAuthUser]);
  // console.log(isAuthUser,user);
  return (
    <div className="bg-white relative ">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row ">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row ">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                Login
              </p>

              <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8 ">
                {loginFormControls.map((controlItem) =>
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
                  ) : null
                )}
                <button
                  disabled={!isFormValid()}
                  onClick={handleLogin}
                  className=" disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide  "
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      color={"#ffff"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                      text={"Logging In"}
                    />
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="flex flex-col gap-2">
                  <p> New to website ?</p>
                  <button
                    className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide "
                    onClick={() => router.push("register")}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default Login;
