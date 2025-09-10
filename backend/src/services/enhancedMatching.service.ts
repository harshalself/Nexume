import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import { geminiClient } from "../utils/geminiClient";
import { ResumeProcessingService } from "./resumeProcessing.service";

interface MatchResult {
  id: string;
  resume_id: string;
  job_id: string;
  match_score: number;
  match_details: {
    basic_score: number;
    ai_score: number;
    combined_score: number;
    ai_analysis: {
      matchScore: number;
      strengths: string[];
      gaps: string[];
      assessment: string;
    };
    basic_analysis: {
      matched_keywords: string[];
      missing_keywords: string[];
      recommendations: string[];
    };
    processing_time: number;
    processed_at: string;
  };
  matched_on: string;
  job_descriptions?: {
    id: string;
    title: string;
    company: string;
    description: string;
  };
  resumes?: {
    id: string;
    name: string;
    email: string;
    file_url: string;
    parsed_data: string;
  };
}

interface EnhancedMatchAnalysis {
  match_score: number;
  basic_analysis: any;
  ai_analysis: any;
  combined_insights: {
    top_strengths: string[];
    critical_gaps: string[];
    improvement_recommendations: string[];
    overall_assessment: string;
    confidence_level: "high" | "medium" | "low";
  };
  metadata: {
    processing_time: number;
    ai_enabled: boolean;
    basic_score: number;
    ai_score: number;
  };
}

export class EnhancedMatchingService {
  private supabase: SupabaseClient;
  private resumeProcessor: ResumeProcessingService;

  constructor() {
    this.supabase = supabase;
    this.resumeProcessor = new ResumeProcessingService();
  }

  /**
   * Perform enhanced matching using both basic TF-IDF and Gemini AI
   */
  async performEnhancedMatch(
    resumeId: string,
    jobId: string
  ): Promise<EnhancedMatchAnalysis> {
    const startTime = Date.now();

    try {
      // Fetch resume and job data
      const { data: resume } = await this.supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .single();

      const { data: jobDescription } = await this.supabase
        .from("job_descriptions")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!resume || !jobDescription) {
        throw new Error("Resume or job description not found");
      }

      // Ensure resume is processed
      if (!resume.parsed_data) {
        throw new Error("Resume must be processed before matching");
      }

      const resumeData = JSON.parse(resume.parsed_data);

      // Perform basic TF-IDF matching
      const basicAnalysis = await this.resumeProcessor.generateMatchAnalysis(
        resumeData.text,
        jobDescription.description
      );
      const basicScore = basicAnalysis.score;

      // Perform AI-enhanced analysis
      let aiAnalysis;
      let aiScore = 0;
      let aiEnabled = true;

      try {
        console.log("🤖 Starting AI analysis...");
        console.log(
          `   📏 Resume text length: ${resumeData.text?.length || 0} characters`
        );
        console.log(
          `   📏 Job description length: ${
            jobDescription.description?.length || 0
          } characters`
        );

        // Debug: Check resume text content
        if (resumeData.text) {
          console.log(
            `   📄 Resume text preview: "${resumeData.text.substring(
              0,
              200
            )}..."`
          );
        } else {
          console.log("   ⚠️ Resume text is empty or undefined!");
        }

        // Debug: Check job description content
        if (jobDescription.description) {
          console.log(
            `   💼 Job description preview: "${jobDescription.description.substring(
              0,
              200
            )}..."`
          );
        } else {
          console.log("   ⚠️ Job description is empty or undefined!");
        }

        aiAnalysis = await geminiClient.analyzeResumeMatch(
          resumeData.text,
          jobDescription.description
        );

        console.log("🤖 AI analysis completed successfully");
        console.log(`   📊 AI Match Score: ${aiAnalysis.matchScore}`);
        console.log(
          `   💪 AI Strengths: ${aiAnalysis.strengths?.length || 0} items`
        );
        console.log(`   🎯 AI Gaps: ${aiAnalysis.gaps?.length || 0} items`);

        aiScore = aiAnalysis.matchScore || 0;
      } catch (error) {
        console.error("❌ AI analysis failed:", error);
        console.error("   🔧 Error details:", error.message);
        console.error("   🔧 Error stack:", error.stack);

        aiAnalysis = {
          matchScore: basicScore,
          strengths: basicAnalysis.strengths || [],
          gaps: basicAnalysis.recommendations || [],
          assessment: `AI analysis failed: ${error.message}. Using basic matching only.`,
        };
        aiScore = basicScore;
        aiEnabled = false;
      }

      // Calculate combined score (weighted average)
      const combinedScore = this.calculateCombinedScore(
        basicScore,
        aiScore,
        aiEnabled
      );

      // Generate combined insights
      const combinedInsights = this.generateCombinedInsights(
        basicAnalysis,
        aiAnalysis,
        aiEnabled
      );

      const processingTime = Date.now() - startTime;

      console.log("🔧 [ENHANCED_MATCHING] Final values before return:");
      console.log(`   🔧 aiEnabled: ${aiEnabled}`);
      console.log(`   🔧 aiScore: ${aiScore}`);
      console.log(`   🔧 basicScore: ${basicScore}`);
      console.log(`   🔧 combinedScore: ${combinedScore}`);

      return {
        match_score: combinedScore,
        basic_analysis: basicAnalysis,
        ai_analysis: aiAnalysis,
        combined_insights: combinedInsights,
        metadata: {
          processing_time: processingTime,
          ai_enabled: aiEnabled,
          basic_score: basicScore,
          ai_score: aiScore,
        },
      };
    } catch (error) {
      console.error("Enhanced matching failed:", error);
      throw new Error(`Enhanced matching failed: ${error.message}`);
    }
  }

  /**
   * Save match result to database
   */
  async saveMatchResult(
    resumeId: string,
    jobId: string,
    matchAnalysis: EnhancedMatchAnalysis
  ): Promise<MatchResult> {
    try {
      const matchData = {
        resume_id: resumeId,
        job_id: jobId,
        match_score: matchAnalysis.match_score,
        match_details: {
          basic_score: matchAnalysis.metadata.basic_score,
          ai_score: matchAnalysis.metadata.ai_score,
          ai_enabled: matchAnalysis.metadata.ai_enabled,
          combined_score: matchAnalysis.match_score,
          ai_analysis: matchAnalysis.ai_analysis,
          basic_analysis: matchAnalysis.basic_analysis,
          combined_insights: matchAnalysis.combined_insights,
          processing_time: matchAnalysis.metadata.processing_time,
          processed_at: new Date().toISOString(),
        },
      };

      const { data, error } = await this.supabase
        .from("matches")
        .insert(matchData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to save match result:", error);
      throw new Error(`Failed to save match result: ${error.message}`);
    }
  }

  /**
   * Get existing match results for a resume
   */
  async getMatchResults(resumeId: string): Promise<MatchResult[]> {
    try {
      const { data, error } = await this.supabase
        .from("matches")
        .select(
          `
          *,
          job_descriptions (
            id,
            title,
            company,
            description
          )
        `
        )
        .eq("resume_id", resumeId)
        .order("matched_on", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get match results:", error);
      throw new Error(`Failed to get match results: ${error.message}`);
    }
  }

  /**
   * Get top matching resumes for a job
   */
  async getTopMatchesForJob(
    jobId: string,
    limit: number = 10
  ): Promise<MatchResult[]> {
    try {
      const { data, error } = await this.supabase
        .from("matches")
        .select(
          `
          *,
          resumes (
            id,
            name,
            email,
            file_url,
            parsed_data
          )
        `
        )
        .eq("job_id", jobId)
        .order("match_score", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get top matches for job:", error);
      throw new Error(`Failed to get top matches for job: ${error.message}`);
    }
  }

  /**
   * Generate insights for a resume across multiple job matches
   */
  async generateResumeInsights(resumeId: string): Promise<any> {
    try {
      const matches = await this.getMatchResults(resumeId);

      if (matches.length === 0) {
        return {
          message: "No matches found for this resume",
          recommendations: [
            "Upload more resumes and create more job descriptions to get insights",
          ],
        };
      }

      // Analyze patterns across matches
      const avgScore =
        matches.reduce((sum, match) => sum + match.match_score, 0) /
        matches.length;
      const topMatch = matches[0];
      const commonGaps = this.findCommonGaps(matches);
      const commonStrengths = this.findCommonStrengths(matches);

      return {
        resume_id: resumeId,
        total_matches: matches.length,
        average_score: Math.round(avgScore),
        best_match: {
          score: topMatch.match_score,
          job_title: topMatch.job_descriptions?.title || "Unknown",
          company: topMatch.job_descriptions?.company || "Unknown",
        },
        common_strengths: commonStrengths,
        improvement_areas: commonGaps,
        career_recommendations: this.generateCareerRecommendations(
          matches,
          avgScore
        ),
        next_steps: this.generateNextSteps(avgScore, commonGaps),
      };
    } catch (error) {
      console.error("Failed to generate resume insights:", error);
      throw new Error(`Failed to generate resume insights: ${error.message}`);
    }
  }

  /**
   * Get all matches with optional filters
   */
  async getAllMatches(
    filters: {
      resumeId?: string;
      jobId?: string;
      minScore?: number;
      maxScore?: number;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<MatchResult[]> {
    try {
      let query = this.supabase.from("matches").select(
        `
          *,
          job_descriptions (
            id,
            title,
            company,
            description
          ),
          resumes (
            id,
            name,
            email,
            file_url,
            parsed_data
          )
        `
      );

      // Apply filters
      if (filters.resumeId) {
        query = query.eq("resume_id", filters.resumeId);
      }

      if (filters.jobId) {
        query = query.eq("job_id", filters.jobId);
      }

      if (filters.minScore !== undefined) {
        query = query.gte("match_score", filters.minScore);
      }

      if (filters.maxScore !== undefined) {
        query = query.lte("match_score", filters.maxScore);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 20) - 1
        );
      }

      // Order by match date (most recent first)
      query = query.order("matched_on", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get all matches:", error);
      throw new Error(`Failed to get all matches: ${error.message}`);
    }
  }

  /**
   * Delete a match result
   */
  async deleteMatch(matchId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("matches")
        .delete()
        .eq("id", matchId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Failed to delete match:", error);
      throw new Error(`Failed to delete match: ${error.message}`);
    }
  }

  /**
   * Calculate combined score from basic and AI analysis
   */
  private calculateCombinedScore(
    basicScore: number,
    aiScore: number,
    aiEnabled: boolean
  ): number {
    if (!aiEnabled) {
      return basicScore;
    }

    // Weighted average: 40% basic, 60% AI (AI tends to be more nuanced)
    const combined = basicScore * 0.4 + aiScore * 0.6;
    return Math.round(combined);
  }

  /**
   * Generate combined insights from basic and AI analysis
   */
  private generateCombinedInsights(
    basicAnalysis: any,
    aiAnalysis: any,
    aiEnabled: boolean
  ) {
    const topStrengths = [
      ...(aiAnalysis.strengths || []),
      ...(basicAnalysis.strengths || []),
    ].slice(0, 5);

    const criticalGaps = [
      ...(aiAnalysis.gaps || []),
      ...(basicAnalysis.missing_keywords || []),
    ].slice(0, 5);

    const recommendations = [
      ...(basicAnalysis.recommendations || []),
      ...(aiAnalysis.gaps || []).map((gap) => `Consider developing: ${gap}`),
    ].slice(0, 5);

    const confidenceLevel: "high" | "medium" | "low" = aiEnabled
      ? aiAnalysis.matchScore >= 70
        ? "high"
        : aiAnalysis.matchScore >= 50
        ? "medium"
        : "low"
      : "medium";

    return {
      top_strengths: topStrengths,
      critical_gaps: criticalGaps,
      improvement_recommendations: recommendations,
      overall_assessment:
        aiAnalysis.assessment || "Analysis completed using available methods",
      confidence_level: confidenceLevel,
    };
  }

  /**
   * Find common gaps across multiple matches
   */
  private findCommonGaps(matches: MatchResult[]): string[] {
    const gapCounts = new Map<string, number>();

    matches.forEach((match) => {
      const gaps = [
        ...(match.match_details.ai_analysis?.gaps || []),
        ...(match.match_details.basic_analysis?.missing_keywords || []),
      ];

      gaps.forEach((gap) => {
        gapCounts.set(gap, (gapCounts.get(gap) || 0) + 1);
      });
    });

    return Array.from(gapCounts.entries())
      .filter(([_, count]) => count >= Math.ceil(matches.length * 0.3)) // Appears in 30%+ of matches
      .sort((a, b) => b[1] - a[1])
      .map(([gap, _]) => gap)
      .slice(0, 5);
  }

  /**
   * Find common strengths across multiple matches
   */
  private findCommonStrengths(matches: MatchResult[]): string[] {
    const strengthCounts = new Map<string, number>();

    matches.forEach((match) => {
      const strengths = [
        ...(match.match_details.ai_analysis?.strengths || []),
        ...(match.match_details.basic_analysis?.matched_keywords || []),
      ];

      strengths.forEach((strength) => {
        strengthCounts.set(strength, (strengthCounts.get(strength) || 0) + 1);
      });
    });

    return Array.from(strengthCounts.entries())
      .filter(([_, count]) => count >= Math.ceil(matches.length * 0.3))
      .sort((a, b) => b[1] - a[1])
      .map(([strength, _]) => strength)
      .slice(0, 5);
  }

  /**
   * Generate career recommendations based on match patterns
   */
  private generateCareerRecommendations(
    matches: MatchResult[],
    avgScore: number
  ): string[] {
    const recommendations = [];

    if (avgScore >= 75) {
      recommendations.push(
        "You have strong qualifications for your target roles"
      );
      recommendations.push(
        "Consider applying to senior or specialized positions"
      );
    } else if (avgScore >= 50) {
      recommendations.push(
        "Focus on developing key skills mentioned in job gaps"
      );
      recommendations.push(
        "Consider gaining experience in emerging technologies"
      );
    } else {
      recommendations.push(
        "Significant skill development needed for target roles"
      );
      recommendations.push(
        "Consider entry-level positions or career transition programs"
      );
    }

    return recommendations;
  }

  /**
   * Generate actionable next steps
   */
  private generateNextSteps(avgScore: number, commonGaps: string[]): string[] {
    const steps = [];

    if (commonGaps.length > 0) {
      steps.push(`Prioritize learning: ${commonGaps.slice(0, 3).join(", ")}`);
    }

    if (avgScore < 60) {
      steps.push("Consider updating resume format and content");
      steps.push("Gain practical experience through projects or internships");
    }

    steps.push("Apply to positions with 70%+ match scores first");
    steps.push("Network within companies that frequently match your profile");

    return steps;
  }
}
