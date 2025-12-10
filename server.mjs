import express from "express"
const app = express()
const port = 4005

app.get("/", (req, res) => {
    res.send("Welcome to Blacio Baez Caceres server!")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})