import RecommendationQuiz from "../../components/RecommendationQuiz";

/**
 * /recommend — the questionnaire
 * ------------------------------------------------------------
 * A thin server-rendered shell around the client quiz component.
 * Answers are kept in the browser and handed to /results.
 */

export const metadata = {
  title: "Find your card — CreditWise",
  description:
    "Answer five questions about how you spend and CreditWise ranks verified credit cards against your answers, showing the reasoning behind every match.",
};

export default function RecommendPage() {
  return (
    <div className="cw-rail">
      <div className="cw-container py-14 md:py-20">
        <header className="mx-auto mb-10 max-w-[640px]">
          <p className="cw-eyebrow mb-3">Find your card</p>
          <h1 className="cw-h2">Five questions about how you spend</h1>
          <p className="cw-body mt-3 text-lead">
            No account needed. Your answers stay in this browser and are used only to
            score all 31 verified cards in the CreditWise catalogue.
          </p>
        </header>

        <RecommendationQuiz />

        <p className="mx-auto mt-6 max-w-[640px] text-center text-[0.8125rem] text-muted">
          Matching is deterministic, rule-based, and fully transparent — no sponsored placements or affiliate rankings.
        </p>
      </div>
    </div>
  );
}
