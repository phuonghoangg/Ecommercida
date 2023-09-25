import connectToDb from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
   

  await connectToDb();
  try {
    const user = "admin";

    if (user === "admin") {
        const extractAllProduct = await Product.find({});

        if(extractAllProduct) {
            return NextResponse.json({
                success: true,
                data: extractAllProduct,
              });
        }else { 
            return NextResponse.json({
                success: false,
                status:204,
                message: "No Product found!! ",
              });
        }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authorized ! ",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something wrongg! pls try again laterrrr",
    });
  }
}

