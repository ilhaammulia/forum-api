const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");

const NewLike = require("../../../Domains/likes/entities/NewLike");

const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("likeComment function", () => {
    it("should persist new like", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ title: "sebuah thread" });
      await CommentsTableTestHelper.addComment({});
      const newLike = new NewLike({
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await likeRepositoryPostgres.likeComment(newLike);

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
    });
  });

  describe("unlikeComment function", () => {
    it("should remove like correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ title: "sebuah thread" });
      await CommentsTableTestHelper.addComment({});
      const newLike = new NewLike({
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await likeRepositoryPostgres.unlikeComment(newLike);

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(0);
    });
  });

  describe("isAlreadyLiked function", () => {
    it("should return true", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});

      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(
        likeRepositoryPostgres.isAlreadyLiked({
          threadId,
          commentId,
          owner,
        })
      ).resolves.toEqual(true);
    });

    it("should return false", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});

      const owner = "user-987";
      const commentId = "comment-987";
      const threadId = "thread-987";

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(
        likeRepositoryPostgres.isAlreadyLiked({
          threadId,
          commentId,
          owner,
        })
      ).resolves.toEqual(false);
    });
  });

  describe("getLikeCount function", () => {
    it("should return 1", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});

      const commentId = "comment-123";

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(
        likeRepositoryPostgres.getLikeCount(commentId)
      ).resolves.toEqual(1);
    });

    it("should return 0", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});
      const commentId = "comment-987";

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(
        likeRepositoryPostgres.getLikeCount(commentId)
      ).resolves.toEqual(0);
    });
  });
});
