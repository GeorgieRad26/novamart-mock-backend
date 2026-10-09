// SIMULATED support request. Records nothing, contacts no one.
export default function handler(req, res) {
  try {
    const { reason, summary } = req.body || {};
    if (!reason || !summary) {
      return res.status(400).json({
        error: "reason and summary required"
      });
    }
    return res.status(200).json({
      status: "request_simulated",
      reference: `SIM-${Date.now().toString().slice(-6)}`,
      simulated: true,
      note: "Simulated support request. Nothing is recorded and no human contact is arranged."
    });
  } catch (e) {
    return res.status(500).json({ error: "support_request_failed" });
  }
}
