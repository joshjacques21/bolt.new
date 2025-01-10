import { useState } from "react";
import { Frame, Stack } from "framer";

// Question Data and Navigation Logic
const questions = [
  {
    id: "Q1",
    prompt: "Does your property have a Gas boiler?",
    options: ["Yes", "No"],
    next: "Q2",
  },
  {
    id: "Q2",
    prompt: "What type of heating do you have?",
    options: ["Oil", "Electric", "Gas", "Solid Fuel", "Heat Pump", "Other"],
    logic: (option) => (option === "Heat Pump" ? "EndCall2" : "Q3"),
  },
  {
    id: "Q3",
    prompt: "Do you own your property, rent privately, live with parents, or rent from the council?",
    options: ["Own", "Rent Privately", "Living with Parents", "Housing Association", "Council House"],
    logic: (option) => (option === "Council House" ? "EndCall2" : "Q4"),
  },
  {
    id: "Q4",
    prompt: "Have you had any government-supplied insulation or heating upgrade in the last 12 years?",
    options: ["Yes", "No", "Unsure"],
    logic: (option) => (option === "Yes" ? "EndCall2" : "Q5"),
  },
  {
    id: "Q5",
    prompt: "Are you currently in receipt of any Government Benefits, and what are they?",
    options: ["Yes", "No", "Unsure"],
    next: "Q6",
  },
  {
    id: "Q6",
    prompt: "Which benefits are you receiving?",
    options: [
      "Universal Credits",
      "Jobseekers Allowance",
      "Employment & Support Allowance",
      "Income Support",
      "Pension Credits",
      "Housing Benefits",
      "Tax Credits",
      "Another Benefit",
    ],
    next: "Q10",
  },
  {
    id: "Q10",
    prompt: "Confirm customer name, address, and contact details.",
    next: "ClosingStatement",
  },
];

// Main Component
export function CallFlowPrototype() {
  const [currentStep, setCurrentStep] = useState("Welcome");
  const [responses, setResponses] = useState({});

  const handleOptionSelect = (option, question) => {
    setResponses({ ...responses, [question.id]: option });
    const nextStep = question.logic ? question.logic(option) : question.next;
    setCurrentStep(nextStep);
  };

  const restartFlow = () => {
    setCurrentStep("Welcome");
    setResponses({});
  };

  const renderScreen = () => {
    if (currentStep === "Welcome") {
      return (
        <Stack gap={16}>
          <Frame style={{ fontSize: 18, marginBottom: 16 }}>
            Good morning… could I speak to Mrs./Mr. X please?
          </Frame>
          <Frame>
            <label>Agent:</label>
            <select>
              <option>Edison</option>
              <option>Isabella</option>
            </select>
          </Frame>
          <button onClick={() => setCurrentStep("Q1")}>Next</button>
        </Stack>
      );
    } else if (currentStep.startsWith("Q")) {
      const question = questions.find((q) => q.id === currentStep);
      return (
        <Stack gap={16}>
          <Frame style={{ fontSize: 18 }}>{question.prompt}</Frame>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option, question)}
            >
              {option}
            </button>
          ))}
        </Stack>
      );
    } else if (currentStep === "EndCall2") {
      return (
        <Stack gap={16}>
          <Frame style={{ fontSize: 18 }}>
            Thanks very much; I see your home does not qualify for ECO 4 at this
            stage. Goodbye.
          </Frame>
          <button onClick={restartFlow}>Restart</button>
        </Stack>
      );
    } else if (currentStep === "ClosingStatement") {
      return (
        <Stack gap={16}>
          <Frame style={{ fontSize: 18 }}>
            Based on your information, you may qualify for government-funded
            heating and insulation upgrades. May we book an assessment?
          </Frame>
          <button>Yes</button>
          <button>No</button>
        </Stack>
      );
    }
    return null;
  };

  return (
    <Frame
      width="100%"
      height="100%"
      background="white"
      style={{ padding: 24, fontFamily: "Arial" }}
    >
      {renderScreen()}
    </Frame>
  );
}
