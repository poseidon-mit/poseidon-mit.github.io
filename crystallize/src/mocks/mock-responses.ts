import type { ModelId, Message } from '@/lib/types';
import { generateId } from '@/lib/utils';

const mockResponses: Record<ModelId, string[]> = {
  claude: [
    "From a governance perspective, the key consideration here is regulatory alignment. Organizations that move too fast without proper frameworks tend to accumulate compliance debt that becomes exponentially more costly to resolve. I'd recommend a three-stage approach:\n\n1. **Audit existing processes** — map where AI touches decision-making\n2. **Define guardrails** — not just technical, but organizational\n3. **Iterate with oversight** — deploy incrementally with human review loops\n\nThe most successful implementations I've seen treat governance as an enabler, not a blocker.",
    "I'd push back slightly on that framing. The underlying assumption conflates correlation with causation. Let me unpack:\n\nThe data shows adoption rates climbing, but the *quality* of adoption varies dramatically. Surface-level metrics like 'number of AI projects' mask whether those projects deliver measurable value. A more rigorous analysis would segment by:\n\n- Time-to-value (months from deployment to ROI)\n- Integration depth (point solution vs. workflow transformation)\n- Organizational readiness score\n\nWithout this granularity, we're comparing apples to assembly lines.",
    "Building on the previous analysis, there's a nuance worth surfacing. The debate between speed and thoroughness is a false dichotomy when you have the right architecture. Consider:\n\n**Progressive deployment** — start with low-stakes decisions, build confidence through measurement, then expand scope. This isn't slower; it's compounding. Each stage generates data that de-risks the next.\n\nThe organizations that get this right aren't choosing between moving fast and being careful. They're building systems where speed *comes from* careful foundation work.",
  ],
  gpt: [
    "The data tells a more complex story than either perspective captures. Let me add some quantitative framing:\n\n**Market reality check:**\n- 73% of enterprise AI projects never make it past pilot stage (Gartner, 2025)\n- Average time from POC to production: 18 months\n- But the top 10% of implementers achieve 5x faster deployment\n\nThe gap isn't about technology — it's about organizational design. Companies that restructure decision-making authority around AI capabilities, rather than bolting AI onto existing hierarchies, consistently outperform.\n\nMy recommendation: focus less on the AI and more on the org chart.",
    "I agree with the directional framing but would sharpen the implementation specifics. There are three concrete patterns I'd highlight:\n\n**Pattern 1: Shadow Operations.** Run AI recommendations alongside human decisions for 90 days. Compare outcomes. This builds both data and trust.\n\n**Pattern 2: Decision Journaling.** Document every AI-influenced decision with rationale. This creates an audit trail and training data for future models.\n\n**Pattern 3: Failure Budgets.** Allocate explicit tolerance for AI errors. Without this, teams become risk-averse and under-utilize the tools.\n\nEach pattern addresses a different failure mode. Use all three.",
    "Looking at this from an implementation standpoint, the technical architecture matters more than most stakeholders realize. Here's why:\n\nA monolithic AI deployment creates a single point of failure for the entire organization. The alternative — a federated approach where each business unit has its own model layer with shared governance — distributes both risk and innovation capacity.\n\n```\nGovernance Layer (centralized)\n    ↓\nModel Registry (shared, versioned)\n    ↓\nBusiness Unit Adapters (decentralized)\n    ↓\nDomain-Specific Fine-tuning (autonomous)\n```\n\nThis architecture lets teams move at their own pace while maintaining organizational coherence.",
  ],
  gemini: [
    "Let me attempt a synthesis that bridges the perspectives raised so far. Both arguments have merit, but they're operating on different time horizons:\n\n**Short-term (6-12 months):** The governance-first approach wins. Organizations without frameworks will face regulatory action, reputational risk, and internal resistance that slows everything down.\n\n**Medium-term (1-3 years):** The speed-focused approach wins. Markets will reward the organizations that achieved production deployment and are generating compounding returns from AI-driven insights.\n\n**Long-term (3-5 years):** Neither approach alone works. The winners will be organizations that built adaptive governance — systems that evolve as fast as the technology.\n\nThe actionable insight: invest in **governance velocity**, not just governance completeness.",
    "The contrarian view worth considering — and I think this challenges assumptions from both previous responses — is that the entire framing of 'AI adoption' as a discrete event is misleading.\n\nAdoption isn't binary. It's a spectrum:\n\n| Level | Description | % of Enterprises |\n|-------|-------------|------------------|\n| 0 | No AI | ~5% |\n| 1 | Experimentation | ~35% |\n| 2 | Point solutions | ~40% |\n| 3 | Workflow integration | ~15% |\n| 4 | AI-native operations | ~5% |\n\nMost 'adoption' discussions conflate Level 1-2 with Level 3-4. The challenges, risks, and strategies are fundamentally different at each level. Advice that's correct for Level 2 can be actively harmful at Level 4.",
    "If we step back to first principles, the question isn't *whether* to adopt AI, but *what kind of organization* you want to become in the process.\n\nEvery technology adoption reshapes the adopter. The printing press didn't just make monks faster at copying — it eliminated the need for monks to copy at all. AI will similarly restructure:\n\n- **Decision authority** — who gets to make calls, and based on what\n- **Skill topology** — which capabilities become table stakes vs. differentiators\n- **Value creation** — where margin lives in the value chain\n\nThe organizations treating AI as a tool to optimize current processes will be outcompeted by those treating AI as a catalyst for structural reimagination. The risk isn't in the technology. It's in the lack of imagination about what to do with it.",
  ],
};

export async function mockSend(model: ModelId, _messages: Message[]): Promise<string> {
  const responses = mockResponses[model];
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function* mockStream(model: ModelId, _messages: Message[]): AsyncGenerator<string> {
  const responses = mockResponses[model];
  const response = responses[Math.floor(Math.random() * responses.length)];
  const words = response.split(' ');
  for (const word of words) {
    await new Promise(r => setTimeout(r, 20 + Math.random() * 40));
    yield word + ' ';
  }
}

export function createMockMessage(model: ModelId, content: string, replyTo?: string): Message {
  return {
    id: generateId(),
    role: 'assistant',
    model,
    content,
    timestamp: Date.now(),
    replyTo,
    meta: {
      tokens: Math.floor(content.split(' ').length * 1.3),
      latencyMs: Math.floor(800 + Math.random() * 2000),
    },
  };
}
