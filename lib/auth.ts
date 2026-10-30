
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import clientPromise from "@/lib/db";

const client = await clientPromise;

export const auth = betterAuth({
  database: mongodbAdapter(client.db("togetherly"), {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },
});
