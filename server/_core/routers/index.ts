import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";
import { User } from "../../models/User";
import { createToken } from "../../auth";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      return ctx.user;
    }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }

        const isValid = await (user as any).comparePassword(input.password);
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }

        const token = await createToken(user._id.toString(), user.email, user.role as "user" | "admin");
        
        ctx.res.cookie(COOKIE_NAME, token, {
          maxAge: ONE_YEAR_MS,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return { success: true, user, token };
      }),

    signup: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6), // Reduced to 6 for demo ease if needed
      }))
      .mutation(async ({ input, ctx }) => {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
        }

        const user = new User({
          name: input.name,
          email: input.email,
          password: input.password,
        });
        await user.save();

        const token = await createToken(user._id.toString(), user.email, user.role as "user" | "admin");

        ctx.res.cookie(COOKIE_NAME, token, {
          maxAge: ONE_YEAR_MS,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return { success: true, user, token };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME);
      return { success: true };
    }),
  }),

  product: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        const products = await Product.find()
          .limit(input?.limit || 50)
          .skip(input?.offset || 0)
          .sort({ createdAt: -1 });
        return products.map(p => ({ ...p.toObject(), id: p._id.toString() }));
      }),

    get: publicProcedure
      .input(z.object({ id: z.string() })) // Changed to string for MongoDB ID
      .query(async ({ input }) => {
        const product = await Product.findById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        return product;
      }),

    stories: publicProcedure.query(async () => {
      const stories = await Product.find({ isSold: true }).sort({ updatedAt: -1 });
      return stories.map(s => ({ ...s.toObject(), id: s._id.toString() }));
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        story: z.string(),
        price: z.any(), // Changed to any to handle strings/numbers
        images: z.array(z.string()).default([]),
      }))
      .mutation(async ({ input }) => {
        const product = new Product(input);
        return await product.save();
      }),

    update: adminProcedure
      .input(z.object({
        id: z.string(), // Changed to string
        name: z.string().optional(),
        description: z.string().optional(),
        story: z.string().optional(),
        price: z.any().optional(),
        images: z.array(z.string()).optional(),
        isSold: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await Product.findByIdAndUpdate(id, updates, { new: true });
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() })) // Changed to string
      .mutation(async ({ input }) => {
        return await Product.findByIdAndDelete(input.id);
      }),
  }),

  order: router({
    create: publicProcedure
      .input(z.object({
        productId: z.string(), // Changed to string
        customerName: z.string(),
        customerEmail: z.string().email(),
        shippingAddress: z.string(),
        totalPrice: z.any(),
      }))
      .mutation(async ({ input }) => {
        const order = new Order({
          ...input,
          status: "pending",
        });
        return await order.save();
      }),

    list: adminProcedure.query(async () => {
      const orders = await Order.find().sort({ createdAt: -1 });
      return orders.map(o => ({ ...o.toObject(), id: o._id.toString() }));
    }),
  }),
});

export type AppRouter = typeof appRouter;