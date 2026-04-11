function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.post("/api/delivery", (req, res) => {
  const rest = { lat: 5.6037, lng: -0.187 };

  const d = distance(rest.lat, rest.lng, req.body.lat, req.body.lng);

  let price = 500;
  if (d > 5) price = 1000;
  if (d > 10) price = 2000;

  res.json({ distance: d, price });
});

app.listen(5000, () => console.log("Server running"));
