const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3002;
const v1Router = require("./routes/index")

app.use(cors());
app.use(express.json());
app.use("/api/v1", v1Router)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})