const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./models/blog.js")
const bcryptjs = require("bcryptjs")


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://vivek:q3w3r7yr77i@cluster0.lzcnjke.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")


//hashed password generator
const keyGen = async (password) => {
    const salt = await bcryptjs.genSalt(10)//salt is a cost factor, always use await when using asynchronous
    return bcryptjs.hash(password, salt)
}

//an async function can be only read by an async function/api
app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = await keyGen(input.password) //(input.key in blog.js file)
    console.log(hashedPassword)
    input.password = hashedPassword //reassign hashkey to input or else it will be plain text
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })

})


app.listen(8080, () => {
    console.log("server running...")
})

