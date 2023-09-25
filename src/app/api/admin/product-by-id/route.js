import connectToDb from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is not required ",
      });
    }

    const getData = await Product.find({ _id: productId });
    if (getData) {
      return NextResponse.json({
        success: true,
        data: getData[0],
      });
    }else { 
        return NextResponse.json({
            success: false,
            status:204,
            message: "Not found ",
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
