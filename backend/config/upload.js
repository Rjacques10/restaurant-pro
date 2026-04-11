const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ================= AUTH =================
app.post("/api/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const admin = await Admin.create({
    username: req.body.username,
    password: hash,
  });
  res.json(admin);
});

app.post("/api/login", async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, admin.password);
  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: admin._id }, "SECRET");
  res.json({ token });
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(403);

  jwt.verify(token, "SECRET", (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}
