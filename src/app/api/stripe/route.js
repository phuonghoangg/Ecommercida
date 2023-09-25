import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const stripe = require("stripe")(
  "sk_test_51NtTG8IqyERJ3WNsImUiC8TLwnwB34rYKjdb6wcA91tUejIZ1E6LrCdN6ke5aaGFJe5syX8VtuVKN5skhYgNVBqr00g0ACvnm8"
);

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const res = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: "http://localhost:3000/checkout" + "?status=success",
        cancel_url: "http://localhost:3000/checkout" + "?status=cancel",
      });


      return NextResponse.json({
        success: true,
        id: session.id,
      });
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
      status: 500,
      message: "Something wrongg! pls try again later",
    });
  }
}
