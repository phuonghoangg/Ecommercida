import Cookies from "js-cookie";
const host = "https://ecommercida-d5b8obapn-phuonghoangg.vercel.app";


export const AddNewAddress = async (formData) => {
  try {
    const res = await fetch(`${host}/api/address/add-new-address`, {
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

export const getAllAddress = async (id) => {
  try {
    const res = await fetch(`${host}/api/address/get-all-address?id=${id}`, {
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

export const updateAddress = async (formData) => {
  try {
    const res = await fetch(`${host}/api/address/update-address`, {
      method: "PUT",
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

export const deleteAddress = async (id) => {
  try {
    const res = await fetch(`${host}/api/address/delete-address?id=${id}`, {
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
