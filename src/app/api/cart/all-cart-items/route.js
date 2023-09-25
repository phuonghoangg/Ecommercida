import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export  async function GET(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Pls Login in!",
        });
      }

      const extractAllCartItem = await Cart.find({ userID: id })
        .populate("userID")
        .populate("productID");

      if (extractAllCartItem) {
        return NextResponse.json({
          success: true,
          data: extractAllCartItem,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No Cart items are found",
          status: 204,
        });
      }
    } else {
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
