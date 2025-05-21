import { TRPCError, protectedProcedure, publicProcedure, router } from '@repo/api';
import { desc, eq } from '@repo/db/drizzle';
import * as v from 'valibot';
import { user } from '#/schemas/auth';
import { PostInsertSchema, posts } from '#/schemas/posts';

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.post?.findMany({
      columns: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: desc(posts.createdAt),
    });
  }),

  one: publicProcedure.input(v.object({ id: v.pipe(v.string(), v.uuid()) })).query(async ({ ctx, input }) => {
    const [dbPost] = await ctx.db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        author: {
          id: user.id,
          name: user.name,
        },
      })
      .from(posts)
      .innerJoin(user, eq(posts.createdBy, user.id))
      .where(eq(posts.id, input.id));

    if (!dbPost) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `No such post with ID ${input.id}`,
      });
    }
    return dbPost;
  }),

  create: protectedProcedure.input(PostInsertSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(posts).values({
      createdBy: ctx.session.user.id,
      ...input,
    });
    return {};
  }),

  delete: protectedProcedure.input(v.object({ id: v.pipe(v.string(), v.uuid()) })).mutation(async ({ ctx, input }) => {
    const { results } = (await ctx.db.delete(posts).where(eq(posts.id, input.id))) as D1Result<typeof posts>;
    // TODO: This was using rowCount earlier but idk
    if (results.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `No such post with id ${input.id}`,
      });
    }
    return {};
  }),

  test: publicProcedure.query(() => {
    return {
      message: 'Hello, world!',
    };
  }),
});
