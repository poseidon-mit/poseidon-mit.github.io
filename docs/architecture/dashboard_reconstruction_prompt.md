# Comprehensive Prompt for Reconstructing Poseidon Dashboard

**Context for the AI:**
You are an expert Frontend Architect and UI/UX Designer tasked with completely reconstructing the Dashboard screen for the "Poseidon" application (an AI-native personal finance platform).
This is the final prototype for an MIT Capstone presentation. The audience (MIT Faculty, CTOs) will be viewing this as a self-guided experience via QR code. 

**Objective:**
Re-create `src/pages/Dashboard.tsx` from scratch. The current dashboard information is too limited. The new Dashboard MUST act as a true "Command Center" summarizing the three core operational engines: **Protect, Grow, and Execute**.

## Core Directives & Constraints (Read Carefully):

1. **Phase 1: Deep Research & Context Loading**
   - **DO NOT** write any code yet. 
   - Start by researching the existing `src/pages/protect/Protect.tsx`, `src/pages/Grow.tsx`, and `src/pages/Execute.tsx`.
   - Read `src/contracts/rebuild-contracts.ts` and `src/lib/demo-state/selectors.ts` to understand the state shape ensuring absolute data consistency.
   - You must thoroughly map out what data is shown on each of these three screens so you can summarize them effectively on the Dashboard.

2. **Phase 2: Data & State Alignment (No Hallucinations)**
   - Display data MUST NOT be mocked with local constants unless it reads from the unified demo state or cross-screen data thread (`CROSS_SCREEN_DATA_THREAD`).
   - Consistency is an absolute requirement. A `THR-001` alert on the Dashboard must match the Protect screen exactly. Monthly savings must match Execute and Grow precisely.

3. **Phase 3: Design Ideation & Clean Architecture Setup**
   - Construct a beautifully designed, premium Dark Mode, "Liquid Glass" interface.
   - **B2C Consumer Focus**: Minimize technical ML jargon. Maximize UX and readability. The layout should be intuitive and guide the user's eyes.
   - Use existing UI components from `src/components/poseidon` (e.g., `EngineBadge`, `ConfidenceIndicator`).
   - **No Technical Debt**: Keep the implementation clean. Separate sub-components (e.g., `DashboardProtectSummary`, `DashboardGrowSummary`, `DashboardExecuteSummary`) into `src/components/dashboard/` to keep `Dashboard.tsx` minimal.
   - Do not make the screen overly complicated. Less is more.

4. **Phase 4: Component Implementation**
   Below are the required sections for the new Dashboard:
   
   - **Overview / KPI Section**:
     - System Confidence (e.g., `0.92`)
     - Compliance Score (e.g., `96/100`)
     - Pending Actions count
     - Total Net Position / Cash flow summary 
   
   - **Protect Summary (Guardian)**:
     - Display a summary of active threats, specifically highlighting the pending review and flagged list.
     - When an item is clicked, or a "View All" button is clicked, it MUST route to `/protect`.
     - Highlight `THR-001` (Critical).

   - **Grow Summary (Forecaster)**:
     - Summarize AI Growth Recommendations. Top ranked suggestions (e.g., `$847/mo` savings, or Emergency Fund progress `73%`).
     - Clicking a recommendation or "View Recommendations" MUST route to `/grow`.

   - **Execute Summary (Autopilot)**:
     - Display the list of pending approvals (Action queue) waiting for human consent.
     - Note the urgency and execution type.
     - Clicking an action or "View Queue" MUST route to `/execute`.
     
   - **Govern Footprint**:
     - The page must continue to use the persistent `GovernFooter`.

5. **Phase 5: Motion and CI Verification**
   - Use `getMotionPreset` from `src/lib/motion-presets.ts`. Ensure elements stagger in beautifully.
   - The application must pass `npm run test -- --run src/__tests__/infra-integrity.test.ts`. If the old Dashboard had specific components that the CI tests check, ensure they are preserved or the test is carefully updated to reflect the new architecture. Do not break the build.
   
**Execution Plan for the Agent:**
Please acknowledge these instructions. Before writing the final `Dashboard.tsx`, present a markdown Architecture Plan of the components you intend to build, mapping the exact data selectors you will use for the Protect, Grow, and Execute summaries. Once the user approves, proceed to write the code.
