# Settings Redesign Prompt for v0 / Claude

**Copy and paste the following prompt into v0 or your AI code generator to redesign the Settings section:**

---

**Role**: You are an elite UI/UX Designer and Frontend Engineer specializing in "Dark-Luxe" React applications. You are redesigning the Settings ecosystem for Poseidon.AI, a high-end, AI-driven financial/governance copilot for the MIT Sloan CTO Program.

**Objective**: Create a comprehensive, unified Settings layout that feels like a "Mission Control" or "Command Center" rather than a boring traditional settings page. It must be visually stunning, using deep blacks, advanced glassmorphism, and subtle neon glows.

## 1. Architectural Structure
The Settings experience should consist of a master layout (`SettingsLayout`) featuring a sleek navigation menu (either a left-hand sidebar or a prominent top-tab rail) and an animated content area for four distinct sections:
1.  **General / Profile (Currently Missing)**: The landing page for Settings.
2.  **AI Preferences (`/settings/ai`)**: Controls for the AI's autonomy.
3.  **Integrations (`/settings/integrations`)**: Managing connected data sources.
4.  **Rights & Privacy (`/settings/rights`)**: Data governance and security.

## 2. Visual Aesthetic (Dark-Luxe)
-   **Backgrounds**: Pitch black (`bg-black` or `bg-zinc-950`).
-   **Containers**: Use Heavy Glassmorphism. Components should have thin, semi-transparent white borders (`border-white/5` or `border-white/10`), sheer backgrounds (`bg-white/[0.02]`), and backdrop blur (`backdrop-blur-xl`).
-   **Typography**: San-serif for UI elements (`Tracking-tight`, `font-medium`), and Monospace (`font-mono`, `uppercase`, `tracking-widest`) for labels, statuses, and metadata.
-   **Accents**: Use subtle neon glows for active states or important toggles. You can use standard Tailwind colors like `cyan-400`, `violet-400`, or `amber-400` to represent the "Engines" of Poseidon.
-   **Motion**: Use Framer Motion (`<motion.div>`) for smooth tab switching (`AnimatePresence`, `opacity`, `y: 5`).

## 3. Screen Specifications & Content

**A. General Settings (New)**
-   **Profile**: User avatar, Name, Role (e.g., "Principal Decision Maker").
-   **Security**: Minimalist toggles for "Hardware Key Authentication", "Biometric Approval", and "Session Timeout".
-   **App Preferences**: Currency display (USD/EUR), timezone, and global notification density (Quiet, Standard, Verbose).

**B. AI Preferences**
-   **Autonomy Sliders**: Visual sliders to control how much Poseidon can do without asking. e.g., "Execution Threshold" (Auto-execute below $1,000).
-   **Engine Aggressiveness**: Separate settings for Protect, Grow, and Execute engines.
-   **Tone & Persona**: Options for "Direct & Concise", "Analytical & Detailed", or "Strategic Coaching".

**C. Integrations**
-   **Grid Layout**: A beautiful grid of connection cards (e.g., Plaid, Stripe, AWS, Coinbase, Corporate Ledger).
-   **Card Design**: Each card should show the integration logo (or a placeholder icon), connection status (green dot for 'Synced 2m ago', red for 'Disconnected'), and a sleek glass toggle switch to enable/disable.

**D. Rights & Privacy**
-   **Data Sovereignty**: A prominent, reassuring section showing that the user owns their data.
-   **LLM Training Opt-Out**: A large, highly stylized toggle showing that "Customer data is NEVER used to train shared models" (Default: ON/Protected).
-   **Immutable Audit Log**: A button to "Export Cryptographic Ledger".
-   **Data Retention**: A visual timeline or slider for how long temporary analysis data is kept (e.g., 7 days, 30 days, Indefinitely).

## 4. Technical Rules
-   Use `lucide-react` for all icons.
-   Provide the code as a consolidated set of React components (or one large file mapping out the routing/state if simpler for a prototype).
-   Ensure all form elements (switches, sliders, inputs) are custom-styled to fit the Dark-Luxe theme—do NOT use native browser default unstyled inputs.
-   Make it fully responsive (the sidebar should collapse into a top or bottom navigation bar on mobile).

**Please generate the complete, production-ready React code (using Tailwind CSS and Framer Motion) for this new Settings ecosystem.**
