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

  public async updateProfile(payload: IUserUpdatePayload): Promise<IUser> {
    const { llm_api_key, ...userData } = payload;

    // Update user metadata in Supabase Auth
    const { data, error } = await supabase.auth.updateUser({
      data: { ...userData, llm_api_key },
    });
    if (error || !data.user) {
      throw new HttpException(400, error?.message || "Profile update failed");
    }

    // If LLM API key is provided, try to store it encrypted in the users table
    if (llm_api_key) {
      try {
        const { error: dbError } = await supabase
          .from("users")
          .update({ llm_api_key_encrypted: llm_api_key })
          .eq("id", data.user.id);

        if (dbError) {
          console.error("Failed to update LLM API key:", dbError.message);
          // Don't throw error, just log it
        }
      } catch (err) {
        console.error("LLM API key storage error:", err);
        // Don't throw error, continue with the update
      }
    }

    return {
      id: data.user.id,
      email: data.user.email,
      first_name: data.user.user_metadata?.first_name || "",
      last_name: data.user.user_metadata?.last_name || "",
      profile_pic: data.user.user_metadata?.profile_pic || "",
      is_deleted: false,
      created_at: data.user.created_at,
      llm_api_key_encrypted: llm_api_key || undefined,
    };
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
