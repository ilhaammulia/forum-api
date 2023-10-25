class LikeRepository {
  async likeComment(like) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async unlikeComment(like) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async isAlreadyLiked(like) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getLikeCount(commentId) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = LikeRepository;
