import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Joi from "joi";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const addToCartSchema = Joi.object({
  userID: Joi.string().required(),
  productID: Joi.string().required(),
});

export async function POST(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const extractData = await req.json();
      const { productID, userID } = extractData;

      const { error } = addToCartSchema.validate({ userID, productID });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const isCurrentCartItemAlreadyExist = await Cart.find({
        productID: productID,
        userID: userID,
      });

      if (isCurrentCartItemAlreadyExist?.length > 0) {
        return NextResponse.json({
          success: false,
          message: "Product already added in cart! pls add different product",
        });
      }

      const saveProductCart = await Cart.create(extractData);
      if (saveProductCart) {
        return NextResponse.json({
          success: true,
          message: "Product added to cart",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add product to cart! pls try again ",
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
