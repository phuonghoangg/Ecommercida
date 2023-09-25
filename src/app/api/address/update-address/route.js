import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDb();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();
      const { _id, fullName, address, city, country, postalCode } = data;
      const updateAddress = await Address.findOneAndUpdate(
        { _id: _id },
        { fullName, address, city, country, postalCode },
        { new: true }
      );

      if (updateAddress) {
        return NextResponse.json({
          success: true,
          message: "Updated successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "failed to update address! pls try again",
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
