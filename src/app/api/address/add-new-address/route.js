import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import Joi from "joi";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AddNewAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  userID: Joi.string().required(),
});

export async function POST(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();

      const { fullName, address, city, country, postalCode, userID } = data;

      const { error } = AddNewAddressSchema.validate({
        fullName,
        address,
        city,
        country,
        postalCode,
        userID,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const newAddedAddress = await Address.create(data);
      if (newAddedAddress) {
        return NextResponse.json({
          success: true,
          message: "Address added successfully ",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Address added failed ",
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
