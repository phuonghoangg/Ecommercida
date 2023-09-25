import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import { firebaseConfig, firebaseStorageURL } from "@/utils";
import { initializeApp } from "firebase/app";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser?.role === "admin") {
      const extractData = await req.json();
      const { _id, imageUrl } = extractData;
      if (!extractData) {
        return NextResponse.json({
          success: false,
          message: "Product ID is required",
        });
      }
      const deleteProduct = await Product.findByIdAndDelete(_id);

      //delete image firebase
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/project-80505.appspot.com/o/";

      let imagePath = imageUrl.replace(baseUrl, "");

      const indexOfEndPath = imagePath.indexOf("?");

      imagePath = imagePath.substring(0, indexOfEndPath);

      imagePath = imagePath.replace("%2F", "/");

      let nameImage = imagePath.slice(84);

      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app, firebaseStorageURL);

      const desertRef = ref(storage, `ecommerce/${nameImage}`);

      deleteObject(desertRef)
        .then(() => {
          // console.log("delete firebase");
        })
        .catch((error) => {
          return NextResponse.json({
            success: true,
            message: "Firebase image not deleted",
          });
        });
      if (deleteProduct) {
        return NextResponse.json({
          success: true,
          message: "Delete product successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Delete product Failed",
        });
      }
    }else{
      return NextResponse.json({
        success: false,
        message: "You are not Authenticated",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something wrongg! pls try again later",
    });
  }
}
