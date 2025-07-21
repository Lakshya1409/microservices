import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { authService } from "../../src/services/auth-service";
import { userService } from "../../src/services/user-service";

// Mock dependencies
jest.mock("../../src/services/user-service");
jest.mock("../../src/config/logger-config", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "TestPassword123!",
        firstName: "John",
        lastName: "Doe",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "customer",
        isVerified: false,
        isActive: true,
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw error for existing email", async () => {
      const userData = {
        email: "existing@example.com",
        password: "TestPassword123!",
        firstName: "John",
        lastName: "Doe",
      };

      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error("Email already exists")
      );

      await expect(authService.register(userData)).rejects.toThrow(
        "Email already exists"
      );
    });
  });

  describe("login", () => {
    it("should login user successfully with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "TestPassword123!",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: loginData.email,
        firstName: "John",
        lastName: "Doe",
        role: "customer",
        isVerified: true,
        isActive: true,
        password: "$2a$10$hashedpassword",
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login(loginData, {} as any);

      expect(result).toBeDefined();
      expect(result.user.email).toBe(loginData.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw error for invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "WrongPassword123!",
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginData, {} as any)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });
});
