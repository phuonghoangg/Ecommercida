import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Address ID is required",
      });
    }

    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const deleteAddress = await Address.findByIdAndDelete(id);
      if (deleteAddress) {
        return NextResponse.json({
          success: true,
          message: "deleted address successfully ! ",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "failed to delete address! pls try again ! ",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "u're not authenticated",
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
