
const host = "https://ecommercida-d5b8obapn-phuonghoangg.vercel.app";

export const registerNewUser = async (formData) => {
    try {
      const response = await fetch(`${host}/api/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const finalData = await response.json();
      
      return finalData;
    } catch (e) {
      console.log("error", e);
    }
  };