const LikeRepository = require("../LikeRepository");

describe("LikeRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const likeRepository = new LikeRepository();

    await expect(likeRepository.likeComment({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(likeRepository.unlikeComment({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(likeRepository.isAlreadyLiked({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(likeRepository.getLikeCount("")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
