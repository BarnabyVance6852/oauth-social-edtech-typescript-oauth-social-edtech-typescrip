import assert from "node:assert/strict";
import { deadlineFor, educatorReport } from "./learner_deadline.ts";

assert.equal(deadlineFor({ learnerId: "l1", courseId: "c1", enrolledAt: "2026-01-15", daysToComplete: 10 }), "2026-01-25");
const report = await educatorReport([{ learnerId: "l1", courseId: "c1", enrolledAt: "2026-01-15", daysToComplete: 10 }]);
assert.equal(report[0].deadline, "2026-01-25");
console.log("deadline decision: pass");
