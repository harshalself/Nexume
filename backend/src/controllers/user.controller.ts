import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { UserSignUpDto, UserSignInDto, UserUpdateDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import HttpException from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export class UserController {
  public userService = new UserService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = Object.assign(new UserSignUpDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }
      const result = await this.userService.signUpUser(dto);
      res.status(201).json({ message: "Sign up successful", ...result });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = Object.assign(new UserSignInDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }
      const result = await this.userService.signInUser(dto);
      res.status(200).json({ message: "Sign in successful", ...result });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const user = await this.userService.getProfile(userId);
      res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");

      const dto = Object.assign(new UserUpdateDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }

      const updatedUser = await this.userService.updateProfile(userId, dto);
      res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const result = await this.userService.softDeleteProfile(userId);
      res.status(200).json({
        message: "User deleted (soft delete) successfully",
        user: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
