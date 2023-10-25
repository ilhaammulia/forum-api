const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddLikeUseCase = require("../AddLikeUseCase");

describe("AddLikeUseCase", () => {
  it("should orchestrating the add like action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };
    const expectedResult = {
      status: "success",
    };
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.likeComment = jest.fn(() =>
      Promise.resolve({
        status: "success",
      })
    );
    mockLikeRepository.isAlreadyLiked = jest.fn(() => Promise.resolve(false));
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyAvailableCommentInThread = jest.fn(() =>
      Promise.resolve()
    );

    const getLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedLike = await getLikeUseCase.execute(useCasePayload);

    expect(addedLike).toStrictEqual(expectedResult);
  });

  it("should orchestrating the unlike action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };
    const expectedResult = {
      status: "success",
    };

    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.likeComment = jest.fn(() =>
      Promise.resolve({
        status: "success",
      })
    );
    mockLikeRepository.unlikeComment = jest.fn(() =>
      Promise.resolve({
        status: "success",
      })
    );
    mockLikeRepository.isAlreadyLiked = jest.fn(() => Promise.resolve(true));
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyAvailableCommentInThread = jest.fn(() =>
      Promise.resolve()
    );

    /** creating use case instance */
    const getLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedLike = await getLikeUseCase.execute(useCasePayload);

    expect(addedLike).toStrictEqual(expectedResult);
  });
});
