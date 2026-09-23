"use client";

import { Login03 } from "@/components/ui/login-03";
import { routes } from "@/constants";

/**
 * Sign In Form component utilizing the Login 3 design system block.
 * Tailored for Nyaya Revolution's situation-first legal learning platform.
 */
export function SignInForm() {
  return (
    <Login03
      title="Sign in to Nyaya."
      subtitle="Continue your legal learning journey. Master your rights, analyze realistic scenarios, and track your progress."
      quote="Knowledge of your legal rights is the ultimate shield in everyday life. Understanding the law empowers every citizen to act with clarity, dignity, and confidence."
      quoteAuthor="Citizen Legal Empowerment"
      quoteRole="Constitution of India · Part III"
      redirectUrl={routes.learn}
    />
  );
}

export default SignInForm;
