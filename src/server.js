require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const uploadConfig = require("./configs/upload");
const AppError = require("./utils/AppError");
const express = require("express");

const cors = require("cors");
const routes = require("./routes");

const app = express();
migrationsRun();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

// express-async-errors handle errors
app.use((error, request, response, next) => {
  console.error(error);
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3331;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
