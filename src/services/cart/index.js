import Cookies from "js-cookie";
const host = "https://ecommercida-d5b8obapn-phuonghoangg.vercel.app";

export const addToCart = async (formData) => {
  try {
    const res = await fetch(`${host}/api/cart/add-to-cart`, {
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

export const getAllCartItem = async (id) => {
  try {
    const res = await fetch(`${host}/api/cart/all-cart-items?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFromCart = async (id) => {
  try {
    const res = await fetch(`${host}/api/cart/delete-from-cart?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
