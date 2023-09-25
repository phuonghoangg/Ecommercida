import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "u're not logged in ",
      });
    }

    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const getAllAddress = await Address.find({ userID: id });
      if (getAllAddress) {
        return NextResponse.json({
          success: true,
          data: getAllAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "failed to get address! pls try again ! ",
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
