import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuthContext } from "../contexts/AuthContext";
import {
  getJobDescriptions,
  addJobDescription,
} from "../services/jobDescription.service";
import { JobDescriptionFormData } from "../lib/validation";

const APITester: React.FC = () => {
  const { user, isAuthenticated, handleSignIn, handleSignOut } =
    useAuthContext();
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const testJobDescriptionsAPI = async () => {
    setLoading(true);
    setTestResult("");
    try {
      const jobs = await getJobDescriptions();
      setTestResult(`✅ Successfully fetched ${jobs.length} job descriptions`);
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateJobAPI = async () => {
    setLoading(true);
    setTestResult("");
    try {
      const testJob: JobDescriptionFormData = {
        title: "Test Job - Frontend Integration",
        description:
          "This is a test job created from the frontend to verify API integration.",
        company: "Test Company",
        location: "Remote",
        requirements: "Testing skills",
        status: "Active" as const,
      };
      const newJob = await addJobDescription(testJob);
      setTestResult(
        `✅ Successfully created job: ${newJob.title} (ID: ${newJob.id})`
      );
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    setTestResult("");
    try {
      const success = await handleSignIn(
        credentials.email,
        credentials.password
      );
      if (success) {
        setTestResult("✅ Successfully signed in!");
      } else {
        setTestResult("❌ Sign in failed");
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 API Integration Tester</CardTitle>
        <p className="text-sm text-gray-600">
          Test the frontend-backend API integration
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Authentication Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Authentication Status</h3>
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <span className="text-green-600">
                ✅ Signed in as: {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-red-600">❌ Not authenticated</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@example.com"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button onClick={testSignIn} disabled={loading}>
                Test Sign In
              </Button>
            </div>
          )}
        </div>

        {/* API Tests */}
        <div className="space-y-3">
          <h3 className="font-semibold">API Tests</h3>
          <div className="flex gap-2">
            <Button
              onClick={testJobDescriptionsAPI}
              disabled={loading || !isAuthenticated}
              variant="outline">
              Test Fetch Jobs
            </Button>
            <Button
              onClick={testCreateJobAPI}
              disabled={loading || !isAuthenticated}
              variant="outline">
              Test Create Job
            </Button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test Result</h3>
            <p className="font-mono text-sm">{testResult}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="text-blue-600">Testing API...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APITester;
