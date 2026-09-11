// ============================================================
// Vercel 서버리스 함수 (Node) — 대시보드 전용 답변 조회
// service_role 키는 이 서버 안에서만 쓰인다. 프론트로 절대 나가지 않음.
// 환경변수(Vercel > Settings > Environment Variables):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DASHBOARD_PASSWORD
// ============================================================

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  // Vercel Node 런타임은 JSON body를 자동 파싱하지만, 혹시 문자열로 오면 수동 파싱
  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  var expected = process.env.DASHBOARD_PASSWORD;
  var given = (body.pw || "").toString();

  // 무차별 대입 속도 약간 늦추기
  await new Promise(function (r) { setTimeout(r, 400); });

  if (!expected || given !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }

  var url = process.env.SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).json({ error: "server not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)" });
  }

  var round = (body.round || "2026-09").toString();
  var endpoint = url.replace(/\/$/, "") +
    "/rest/v1/responses?round=eq." + encodeURIComponent(round) +
    "&order=created_at.desc&select=*";

  try {
    var r = await fetch(endpoint, {
      headers: { apikey: key, Authorization: "Bearer " + key }
    });
    if (!r.ok) {
      var t = await r.text();
      return res.status(502).json({ error: "supabase " + r.status, detail: t });
    }
    var rows = await r.json();
    return res.status(200).json({ rows: rows });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
