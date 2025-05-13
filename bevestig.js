export default async function handler(req, res) {
  const { project_id, token } = req.query;

  // Controleer of de token correct is
  if (token !== "confirm2025") {
    return res.status(401).json({ error: "Ongeldige token" });
  }

  if (!project_id) {
    return res.status(400).json({ error: "Project ID ontbreekt" });
  }

  try {
    const apiToken = process.env.RENTMAN_API_TOKEN;

    const response = await fetch(`https://api.rentman.net/v4/projects/${project_id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "Bevestigd"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: "Rentman API fout", details: errorData });
    }

    return res.status(200).json({ message: "Offerte succesvol bevestigd." });
  } catch (err) {
    return res.status(500).json({ error: "Serverfout", details: err.message });
  }
}
