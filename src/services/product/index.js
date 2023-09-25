//add product
const host = "https://ecommercida-d5b8obapn-phuonghoangg.vercel.app";

import Cookies from "js-cookie";

export const addNewProduct = async (formData) => {
  try {
    const res = await fetch(`${host}/api/admin/add-product`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllAdminProduct = async () => {
  try {
    const res = await fetch(`${host}/api/admin/all-products`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (formData) => {
  try {
    const res = await fetch(`${host}/api/admin/update-product`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (formData) => {
  try {
    const res = await fetch(`${host}/api/admin/delete-product`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const productByCategory = async (id) => {
  try {
    const res = await fetch(`${host}/api/admin/product-by-category?id=${id}`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const productById = async (id) => {
  try {
    const res = await fetch(`${host}/api/admin/product-by-id?id=${id}`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
