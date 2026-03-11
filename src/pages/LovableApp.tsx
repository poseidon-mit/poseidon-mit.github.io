import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LovableAppLayout from "@/components/layout/LovableAppLayout";
import LovableLanding from "@/pages/LovableLanding";
import LovableOnboarding from "@/pages/LovableOnboarding";
import LovableDashboard from "@/pages/LovableDashboard";
import LovableProtect from "@/pages/protect/LovableProtect";
import LovableAlertDetail from "@/pages/protect/LovableAlertDetail";
import LovableGrow from "@/pages/grow/LovableGrow";
import LovableRecommendation from "@/pages/grow/LovableRecommendation";
import LovableExecute from "@/pages/execute/LovableExecute";
import LovableApproval from "@/pages/execute/LovableApproval";
import LovableGovern from "@/pages/govern/LovableGovern";
import LovableAudit from "@/pages/govern/LovableAudit";
import LovableChat from "@/pages/chat/LovableChat";

export default function LovableApp() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/lovable" element={<LovableLanding />} />
        <Route path="/lovable/onboarding" element={<LovableOnboarding />} />
        <Route element={<LovableAppLayout />}>
          <Route path="/lovable/dashboard" element={<LovableDashboard />} />
          <Route path="/lovable/protect" element={<LovableProtect />} />
          <Route path="/lovable/protect/alert-detail/:id" element={<LovableAlertDetail />} />
          <Route path="/lovable/grow" element={<LovableGrow />} />
          <Route path="/lovable/grow/recommendation/:id" element={<LovableRecommendation />} />
          <Route path="/lovable/execute" element={<LovableExecute />} />
          <Route path="/lovable/execute/approval/:id" element={<LovableApproval />} />
          <Route path="/lovable/govern" element={<LovableGovern />} />
          <Route path="/lovable/govern/audit" element={<LovableAudit />} />
          <Route path="/lovable/chat" element={<LovableChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
