const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const registerRoute = require("./routes/register");

dotenv.config();
const connectDB= async() =>{
  try{
      await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true , useFindAndModify: false})
      console.log('connected to mongo')
  }catch(err){
      console.error(err.message)
      process.exit(1)
  }
}

connectDB()

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/authenticate", authRoute);
app.use("/api", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/register", registerRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
