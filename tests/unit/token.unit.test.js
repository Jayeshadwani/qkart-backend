const { userOne } = require("../fixtures/user.fixture");
const { tokenService } = require("../../src/services");
const { generateToken } = require("../../src/services/token.service");
const { config } = require("dotenv").config();

describe("User test", () => {
  describe("Generate auth tokens", () => {
    it("should return tokens", async () => {
      let tokenResponse = await tokenService.generateAuthTokens(userOne);
      expect(tokenResponse.access).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          expires: expect.any(Date),
        })
      );
    });
  });
});
