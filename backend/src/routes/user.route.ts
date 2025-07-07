import { Router } from "express";
import Route from "../interfaces/route.interface";
import { UserController } from "../controllers/user.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import { UserSignUpDto, UserSignInDto, UserUpdateDto } from "../dtos/user.dto";

class UserRoute implements Route {
  public path = "/auth";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(UserSignUpDto, "body", false, []),
      this.userController.signUp
    );
    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(UserSignInDto, "body", false, []),
      this.userController.signIn
    );
    this.router.get(`${this.path}/profile`, this.userController.getProfile);
    this.router.patch(
      `${this.path}/profile`,
      validationMiddleware(UserUpdateDto, "body", false, []),
      this.userController.updateProfile
    );
    this.router.delete(
      `${this.path}/profile`,
      this.userController.deleteProfile
    );
  }
}

export default UserRoute;
