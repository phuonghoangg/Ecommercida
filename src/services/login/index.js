const host = "ecommercida-o4pos2vx5-phuonghoangg.vercel.app";

export const login = async (formData) => {
  try {
    const res = await fetch(`${host}/api/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
