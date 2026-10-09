// MOCK return initiation. No real return is created.
const DAY_MS = 86400000;
const daysAgo = (n) =>
  new Date(Date.now() - (n / (1 / DAY_MS))).toISOString().slice(0, 10);
const FIXTURE_ACCOUNT = "10000001";
const RETURN_WINDOW_DAYS = 30;
const ELECTRONICS_CATEGORIES = new Set(["audio"]);

function buildReturnFixtures() {
  return {
    "55501": {
      account_number: FIXTURE_ACCOUNT,
      purchase_date: daysAgo(10),
      items: [{ name: "Nova Electric Kettle K2", category: "home_goods" }]
    },
    "55502": {
      account_number: FIXTURE_ACCOUNT,
      purchase_date: daysAgo(10),
      items: [{ name: "Nova Earbuds Pro", category: "audio" }]
    },
    "55503": {
      account_number: FIXTURE_ACCOUNT,
      purchase_date: daysAgo(45),
      items: [{ name: "Nova Desk Lamp Pro", category: "home_goods" }]
    }
  };
}

export function evaluateReturn(
  order,
  { account_number, has_receipt, item_opened },
  nowMs = Date.now()
) {
  if (String(account_number) !== order.account_number) {
    return { status: "account_mismatch", reason: "account_mismatch" };
  }
  const ageDays = Math.floor(
    (nowMs - Date.parse(order.purchase_date)) / DAY_MS
  );
  if (ageDays > RETURN_WINDOW_DAYS) {
    return { status: "refused", reason: "outside_return_window" };
  }
  if (!has_receipt) {
    return { status: "refused", reason: "no_receipt" };
  }
  if (
    item_opened &&
    order.items.some((i) => ELECTRONICS_CATEGORIES.has(i.category))
  ) {
    return { status: "refused", reason: "opened_electronics" };
  }
  return { status: "return_initiated", reason: "none" };
}

export default function handler(req, res) {
  try {
    const {
      account_number, order_id, has_receipt, item_opened
    } = req.body || {};

    if (!account_number || !order_id) {
      return res.status(400).json({
        error: "account_number and order_id required"
      });
    }
    if (
      typeof has_receipt !== "boolean" ||
      typeof item_opened !== "boolean"
    ) {
      return res.status(400).json({
        error: "has_receipt and item_opened must be true or false"
      });
    }

    const order = buildReturnFixtures()[order_id];
    if (!order) {
      return res.status(200).json({
        status: "unavailable",
        reason: "no_return_record",
        return_id: "none",
        order_id,
        mock: true
      });
    }

    const result = evaluateReturn(order, {
      account_number, has_receipt, item_opened
    });
    const return_id = result.status === "return_initiated"
      ? `MOCK-RET-${order_id}-${Date.now().toString().slice(-6)}`
      : "none";

    return res.status(200).json({
      ...result, return_id, order_id, mock: true
    });
  } catch (e) {
    return res.status(500).json({ error: "return_failed" });
  }
}
