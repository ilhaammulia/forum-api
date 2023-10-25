const pool = require("../../database/postgres/pool");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200 and persisted like", async () => {
      const server = await createServer(container);
      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({
          server,
          username: "userbudi",
        });
      await ThreadsTableTestHelper.addThread({
        id: "thread-987",
        title: "sebuah thread",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-987",
        content: "sebuah comment",
        threadId: "thread-987",
        owner: userId,
      });

      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-987/comments/comment-987/likes",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
