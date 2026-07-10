export default function View() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-gray-500">
        The fake-detection probe now uses the shared
        is_auto_approve_eligible policy helper instead of a hardcoded 0.80
        confidence threshold.
      </p>

      <p className="text-sm text-gray-500">
        Under the current policy, min_confidence_for_auto is set to 2.0 as a
        disabled sentinel. Since confidence values range from 0 to 1, no AI
        fake samples enter the auto-approve band.
      </p>

      <p className="text-sm text-gray-500">
        This makes the probe’s reported fake-risk consistent with the real
        production policy and shows why human review is still required.
      </p>
    </section>
  );
}
