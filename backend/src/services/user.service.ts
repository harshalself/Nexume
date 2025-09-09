import { supabase } from "../utils/supabaseClient";
import {
  IUserSignUpPayload,
  IUserSignInPayload,
  IUserResponsePayload,
  IUserUpdatePayload,
  IUser,
} from "../interfaces/user.interface";
import HttpException from "../exceptions/HttpException";

export class UserService {
  public async signUpUser(
    payload: IUserSignUpPayload
  ): Promise<IUserResponsePayload> {
    const { email, password, first_name, last_name } = payload;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name },
      },
    });
    if (error || !data.user) {
      throw new HttpException(400, error?.message || "Sign up failed");
    }
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        first_name,
        last_name,
        profile_pic: "",
        is_deleted: false,
        created_at: data.user.created_at,
      },
      accessToken: data.session?.access_token || "",
    };
  }

  public async signInUser(
    payload: IUserSignInPayload
  ): Promise<IUserResponsePayload> {
    const { email, password } = payload;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      throw new HttpException(401, error?.message || "Sign in failed");
    }
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.user_metadata?.first_name || "",
        last_name: data.user.user_metadata?.last_name || "",
        profile_pic: "",
        is_deleted: false,
        created_at: data.user.created_at,
      },
      accessToken: data.session?.access_token || "",
    };
  }

  public async updateProfile(
    userId: string,
    payload: IUserUpdatePayload
  ): Promise<IUser> {
    const { llm_api_key, ...authData } = payload;

    // Update user metadata in Supabase Auth
    const { data: authDataResult, error: authError } =
      await supabase.auth.updateUser({
        data: authData,
      });
    if (authError || !authDataResult.user) {
      throw new HttpException(
        400,
        authError?.message || "Profile update failed"
      );
    }

    // Prepare database update data
    const dbUpdateData: any = {};
    if (llm_api_key !== undefined) {
      dbUpdateData.llm_api_key_encrypted = llm_api_key;
    }

    // Update user in database if there are database fields to update
    if (Object.keys(dbUpdateData).length > 0) {
      const { data: dbData, error: dbError } = await supabase
        .from("users")
        .update(dbUpdateData)
        .eq("id", userId)
        .select("*")
        .single();

      if (dbError) {
        throw new HttpException(
          400,
          dbError.message || "Database update failed"
        );
      }

      return {
        id: dbData.id,
        email: dbData.email,
        first_name: dbData.first_name,
        last_name: dbData.last_name,
        profile_pic: dbData.profile_pic,
        is_deleted: dbData.is_deleted,
        created_at: dbData.created_at,
        llm_api_key_encrypted: dbData.llm_api_key_encrypted
          ? "configured"
          : undefined,
      };
    }

    // If no database fields to update, return current user data
    return await this.getProfile(userId);
  }

  public async softDeleteProfile(userId: string): Promise<IUser> {
    const { data, error } = await supabase
      .from("users")
      .update({ is_deleted: true })
      .eq("id", userId)
      .select("*")
      .single();
    if (error || !data) {
      throw new HttpException(400, error.message || "Failed to delete user");
    }
    return data as IUser;
  }

  public async getProfile(userId: string): Promise<IUser> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) {
      throw new HttpException(404, "User not found");
    }
    return data as IUser;
  }
}
