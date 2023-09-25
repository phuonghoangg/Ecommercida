import Cookies from "js-cookie";
const host = "https://ecommercida-d5b8obapn-phuonghoangg.vercel.app";

export const callStripeSession = async (formData) => {
  try {
    const res = await fetch(`${host}/api/stripe`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
