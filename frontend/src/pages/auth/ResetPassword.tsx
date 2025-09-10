import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Navbar from "../../components/Navbar";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "../../lib/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual password reset API call
      // const response = await resetPassword(token, data.password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <Navbar />
        <div
          className={cn(
            "flex flex-1 items-center justify-center h-auto bg-background"
          )}>
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Invalid Reset Link
              </h1>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-medium">
                Request a new reset link
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div
          className={cn(
            "flex flex-1 items-center justify-center h-auto bg-background"
          )}>
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                Password Reset Successful
              </h1>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You'll be redirected
                to the sign-in page shortly.
              </p>
              <Link
                to="/signin"
                className="text-blue-600 hover:text-blue-800 font-medium">
                Go to Sign In
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className={cn(
          "flex flex-1 items-center justify-center h-auto bg-background"
        )}>
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Reset Password
              </h1>
              <p className="text-gray-600 mt-2">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  {...register("password")}
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.confirmPassword &&
                      "border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting
                  ? "Resetting Password..."
                  : "Reset Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-sm text-blue-600 hover:text-blue-800">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
