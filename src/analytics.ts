import { addDoc } from "@firebase/firestore";
import { analytics } from "./db";
import type { AnalyticsReport } from "./types";

export const saveAnalytics = async (report: AnalyticsReport) => {
  await addDoc(analytics, report);
}