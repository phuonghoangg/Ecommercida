import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import { firebaseConfig, firebaseStorageURL } from "@/utils";
import { initializeApp } from "firebase/app";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDb();

    const isAuthUser = await AuthUser(req);
    if (isAuthUser?.role === "admin") {

      const extractData = await req.json();

      const {
        _id,
        name,
        price,
        description,
        category,
        sizes,
        deliveryInfo,
        onSale,
        priceDrop,
        imageUrl,
      } = extractData;
  
      const updateImage = await Product.findOne({ _id: _id });
  
      //check image firebase changed
      
  
      if (updateImage.imageUrl !== imageUrl) {
  
        const baseUrl =
          "https://firebasestorage.googleapis.com/v0/b/project-80505.appspot.com/o/";
  
        let imagePath = updateImage.imageUrl.replace(baseUrl, "");
  
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
      }
      //END FUNCTION
  
      const updateProduct = await Product.findOneAndUpdate(
        { _id: _id },
        {
          name,
          price,
          description,
          category,
          sizes,
          deliveryInfo,
          onSale,
          priceDrop,
          imageUrl,
        },
        { new: true }
      );
  
      if (updateProduct) {
        return NextResponse.json({
          success: true,
          message: "Product updated successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to update product! pls try again",
        });
      }
    }else{
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
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
