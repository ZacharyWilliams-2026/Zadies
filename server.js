const app = require("./app");
const connectDB = require("./config/connectionString");

//Port
const PORT = 3000;

//Listener
async function connectServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("Failed to connect to server", error);

    }
}

connectServer();