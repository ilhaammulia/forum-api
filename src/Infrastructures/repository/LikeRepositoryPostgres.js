const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, generatorId) {
    super();
    this._pool = pool;
    this._generatorId = generatorId;
  }

  async likeComment(newLike) {
    const { owner, threadId, commentId } = newLike;
    const id = `like-${this._generatorId()}`;

    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
      values: [id, threadId, commentId, owner],
    };

    await this._pool.query(query);
  }

  async unlikeComment(newLike) {
    const { owner, threadId, commentId } = newLike;

    const query = {
      text: "DELETE FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3",
      values: [threadId, commentId, owner],
    };

    await this._pool.query(query);
  }

  async isAlreadyLiked(newLike) {
    const { owner, threadId, commentId } = newLike;

    const query = {
      text: "SELECT * FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3",
      values: [threadId, commentId, owner],
    };

    const result = await this._pool.query(query);
    return Boolean(result.rowCount);
  }

  async getLikeCount(commentId) {
    const query = {
      text: "SELECT COUNT(id) FROM likes WHERE comment_id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return Number(result.rows[0].count);
  }
}

module.exports = LikeRepositoryPostgres;
