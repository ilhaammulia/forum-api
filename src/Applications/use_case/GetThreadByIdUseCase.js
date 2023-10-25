const DetailComment = require("../../Domains/comments/entities/DetailComment");
const DetailReply = require("../../Domains/replies/entities/DetailReply");

class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    let comments = await this._commentRepository.getCommentsByThreadId(id);
    const replies = await this._replyRepository.getRepliesByThreadId(id);

    comments = await Promise.all(
      comments.map(async (comment) => {
        const detailComment = new DetailComment(comment);
        const likeCount = await this._likeRepository.getLikeCount(comment.id);
        return {
          ...detailComment,
          likeCount,
          replies: replies
            .filter((reply) => reply.comment_id === comment.id)
            .map((reply) => ({ ...new DetailReply(reply) })),
        };
      })
    );

    return { ...thread, comments };
  }
}

module.exports = GetThreadByIdUseCase;
