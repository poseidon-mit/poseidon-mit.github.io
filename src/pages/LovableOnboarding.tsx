import { useState } from "react";
import {  Link  } from "@/router";
import { CheckCircle } from "lucide-react";

const STEPS = ["Welcome", "Connect Accounts", "Preferences", "Ready"];

export default function LovableOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState<string>("Moderate");
  const [notifications, setNotifications] = useState(true);

  const next = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECEAE5] p-4">
      <div className="w-full max-w-md">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-colors ${
                i <= currentStep ? "bg-cyan-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div key={currentStep} className="animate-fade-in">
          {currentStep === 0 && <StepWelcome />}
          {currentStep === 1 && <StepAccounts />}
          {currentStep === 2 && (
            <StepPreferences
              riskTolerance={riskTolerance}
              setRiskTolerance={setRiskTolerance}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}
          {currentStep === 3 && <StepReady />}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {currentStep < 3 ? (
            <>
              <button
                onClick={next}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl px-8 py-3 min-h-[44px] transition-colors"
              >
                Continue
              </button>
              <button
                onClick={next}
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Skip &rarr;
              </button>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="w-full block text-center bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl px-8 py-3 min-h-[44px] transition-colors"
            >
              Enter Dashboard &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="text-center">
      <span className="text-5xl block mb-4">{"\uD83D\uDD31"}</span>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to Poseidon, Shinji
      </h1>
      <p className="text-gray-600">
        Let's set up your AI financial assistant
      </p>
    </div>
  );
}

function StepAccounts() {
  const accounts = [
    { name: "Chase", type: "Banking" },
    { name: "American Express", type: "Credit" },
    { name: "Fidelity", type: "Investments" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
        Connect Accounts
      </h2>
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="bg-white rounded-xl border p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900">{account.name}</p>
              <p className="text-sm text-gray-500">{account.type}</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPreferences({
  riskTolerance,
  setRiskTolerance,
  notifications,
  setNotifications,
}: {
  riskTolerance: string;
  setRiskTolerance: (v: string) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
}) {
  const riskOptions = ["Conservative", "Moderate", "Aggressive"];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
        Preferences
      </h2>

      {/* Risk Tolerance */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Risk Tolerance
        </p>
        <div className="grid grid-cols-3 gap-2">
          {riskOptions.map((option) => (
            <button
              key={option}
              onClick={() => setRiskTolerance(option)}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                riskTolerance === option
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Notifications</p>
        <div
          onClick={() => setNotifications(!notifications)}
          className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors ${
            notifications ? "bg-cyan-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              notifications ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function StepReady() {
  return (
    <div className="text-center">
      <span className="text-5xl block mb-4">{"\uD83C\uDF89"}</span>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        You're all set!
      </h1>
      <p className="text-gray-600">
        Your AI financial assistant is ready to go.
      </p>
    </div>
  );
}
