const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const GetThreadByIdUseCase = require("../GetThreadByIdUseCase");
const LikeRepository = require("../../../Domains/likes/LikeRepository");

describe("GetThreadByIdUseCase", () => {
  it("should orchestrating the get thread by id action correctly", async () => {
    const useCasePayload = { id: "thread-123" };
    const currentDate = new Date();
    const expectedThread = {
      id: "thread-123",
      title: "new thread",
      body: "body",
      date: currentDate,
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: currentDate,
          content: "body",
          likeCount: 0,
          replies: [
            {
              id: "reply-123",
              content: "new reply",
              date: currentDate,
              username: "dicoding",
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve(
        new DetailThread({
          id: "thread-123",
          title: "new thread",
          body: "body",
          date: currentDate,
          username: "dicoding",
        })
      )
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "comment-123",
          username: "dicoding",
          date: currentDate,
          content: "body",
          is_deleted: false,
        },
      ])
    );

    mockReplyRepository.getRepliesByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "reply-123",
          comment_id: "comment-123",
          content: "new reply",
          date: currentDate,
          is_deleted: false,
          username: "dicoding",
        },
      ])
    );

    mockLikeRepository.getLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadByIdUseCase.execute(useCasePayload.id);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockLikeRepository.getLikeCount).toBeCalledWith("comment-123");
  });

  it("should not display deleted content", async () => {
    const useCasePayload = { id: "thread-123" };
    const currentDate = new Date();
    const expectedThread = {
      id: "thread-123",
      title: "new thread",
      body: "body",
      date: currentDate,
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: currentDate,
          content: "comment",
          likeCount: 0,
          replies: [
            {
              id: "reply-123",
              content: "**balasan telah dihapus**",
              date: currentDate,
              username: "dicoding",
            },
          ],
        },
        {
          id: "comment-124",
          username: "dicoding",
          date: currentDate,
          content: "**komentar telah dihapus**",
          likeCount: 0,
          replies: [],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve(
        new DetailThread({
          id: "thread-123",
          title: "new thread",
          body: "body",
          date: currentDate,
          username: "dicoding",
        })
      )
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "comment-123",
          username: "dicoding",
          date: currentDate,
          content: "comment",
          is_deleted: false,
        },
        {
          id: "comment-124",
          username: "dicoding",
          date: currentDate,
          content: "comment",
          is_deleted: true,
        },
      ])
    );
    mockReplyRepository.getRepliesByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "reply-123",
          comment_id: "comment-123",
          content: "new reply",
          date: currentDate,
          is_deleted: true,
          username: "dicoding",
        },
      ])
    );

    mockLikeRepository.getLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadByIdUseCase.execute(useCasePayload.id);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockLikeRepository.getLikeCount).toBeCalledWith("comment-123");
  });
});
