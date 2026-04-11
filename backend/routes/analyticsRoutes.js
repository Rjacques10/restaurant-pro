app.get("/api/analytics", async (req, res) => {
  const menus = await Menu.countDocuments();
  const orders = await Order.countDocuments();
  const allOrders = await Order.find();

  const revenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  res.json({ menus, orders, revenue });
});
