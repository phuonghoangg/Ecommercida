import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export  async function DELETE(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Cart Item ID is required",
        });
      }

      const deleteCartItem = await Cart.findByIdAndDelete(id);

      if (deleteCartItem) {
        return NextResponse.json({
          success: true,
          message: "Delete cart item successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed delete cart item",
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
