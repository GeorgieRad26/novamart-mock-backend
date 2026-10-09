const DAY_MS = 86400000;
const daysAgo = (n) =>
  new Date(Date.now() - (n / (1 / DAY_MS))).toISOString().slice(0, 10);
const FIXTURE_ACCOUNT = "10000001";

function buildOrders() {
  return {
    "12345": {
      order_id: "12345",
      status: "shipped",
      items: [{ name: "Nova Headphones X1", qty: 1, price: 149.00 }],
      expected_delivery_date: "2026-05-22",
      shipping_address: "742 Evergreen Terrace, Springfield",
      fulfillment_center: "FC-WEST-03"
    },
    "67890": {
      order_id: "67890",
      status: "processing",
      items: [{ name: "Nova Smart Speaker Mini", qty: 2, price: 79.00 }],
      expected_delivery_date: "2026-05-25",
      shipping_address: "1600 Pennsylvania Ave NW, Washington DC",
      fulfillment_center: "FC-EAST-01"
    },
    "55501": {
      order_id: "55501",
      account_number: FIXTURE_ACCOUNT,
      status: "delivered",
      items: [{ name: "Nova Electric Kettle K2", qty: 1, price: 45.00, category: "home_goods" }],
      purchase_date: daysAgo(10),
      delivered_date: daysAgo(7),
      shipping_address: "742 Evergreen Terrace, Springfield",
      fulfillment_center: "FC-WEST-03"
    },
    "55502": {
      order_id: "55502",
      account_number: FIXTURE_ACCOUNT,
      status: "delivered",
      items: [{ name: "Nova Earbuds Pro", qty: 1, price: 89.00, category: "audio" }],
      purchase_date: daysAgo(10),
      delivered_date: daysAgo(7),
      shipping_address: "742 Evergreen Terrace, Springfield",
      fulfillment_center: "FC-WEST-03"
    },
    "55503": {
      order_id: "55503",
      account_number: FIXTURE_ACCOUNT,
      status: "delivered",
      items: [{ name: "Nova Desk Lamp Pro", qty: 1, price: 59.00, category: "home_goods" }],
      purchase_date: daysAgo(45),
      delivered_date: daysAgo(42),
      shipping_address: "742 Evergreen Terrace, Springfield",
      fulfillment_center: "FC-WEST-03"
    }
  };
}

export default function handler(req, res) {
  try {
    const { order_id } = req.body || {};
    if (!order_id) return res.status(400).json({ error: "order_id required" });
    const order = buildOrders()[order_id];
    if (!order) return res.status(200).json({ status: "not_found", order_id });
    return res.status(200).json(order);
  } catch (e) {
    return res.status(500).json({ error: "lookup_failed" });
  }
}
