const DetailComment = require("../DetailComment");

describe("DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {};

    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type spec", () => {
    const payload = {
      id: 123,
      username: "dicoding",
      date: "2022",
      content: "content",
      is_deleted: "true",
    };

    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DetailComment object correctly", () => {
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: new Date(),
      content: "content",
      is_deleted: false,
    };

    const { id, username, date, content } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it("should create DetailComment object correctly and not show deleted content", () => {
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: new Date(),
      content: "content",
      is_deleted: true,
    };
    const deletedContent = "**komentar telah dihapus**";

    const { id, username, date, content } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(deletedContent);
  });
});
