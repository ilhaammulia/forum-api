const NewLike = require("../../Domains/likes/entities/NewLike");

class AddLikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newLike = new NewLike(useCasePayload);
    await this._threadRepository.verifyAvailableThread(newLike.threadId);
    await this._commentRepository.verifyAvailableCommentInThread(
      newLike.commentId,
      newLike.threadId
    );

    const isAlreadyLiked = await this._likeRepository.isAlreadyLiked(newLike);

    if (isAlreadyLiked) {
      return this._likeRepository.unlikeComment(newLike);
    }
    return this._likeRepository.likeComment(newLike);
  }
}

module.exports = AddLikeUseCase;
