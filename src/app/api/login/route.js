import connectToDb from "@/database";
import User from "@/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDb();
  const { email, password } = await req.json();

 
  const { error } = loginUserSchema.validate({ email, password });
  
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }


  try {
 
    const checkAccount = await User.findOne({ email });
    if (!checkAccount) {
      return NextResponse.json({
        success: false,
        message: "Email or password wrong",
      });
    }

    const checkPassword = await compare(password, checkAccount.password);

    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: "Email or password wrong",
      });
    }

    const token = jwt.sign(
      {
        id: checkAccount._id,
        email: checkAccount.email,
        role: checkAccount.role,
      },
      "default_secret_key",
      { expiresIn: "1d" }
    );

    const finalData = {
      token: token,
      user: {
        email: checkAccount.email,
        name: checkAccount.name,
        _id: checkAccount._id,
        role: checkAccount.role,
      },
    };

    return NextResponse.json({
      success: true,
      message: "Login successfully! ",
      finalData,
    });
  } catch (error) {
    console.log("error is Login user ");
    return NextResponse.json({
      success: false,
      message: "Something wrongg! pls try again later",
    });
  }
}
