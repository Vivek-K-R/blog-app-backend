const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./models/blog.js")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://vivek:q3w3r7yr77i@cluster0.lzcnjke.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")


//hashed password generator
const keyGen = async (password) => {
    const salt = await bcryptjs.genSalt(10)//salt is a cost factor, always use await when using asynchronous
    return bcryptjs.hash(password, salt)
}


//signUp
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


//signIn
app.post("/signIn", (req, res) => {

    let input = req.body
    blogmodel.find({ "email": req.body.email }).then(
        (response) => {

            if (response.length > 0) {
                let dbPassword = response[0].password
                console.log(dbPassword)
                bcryptjs.compare(input.password, dbPassword, (error, isMatch) => {
                    if (isMatch) {
                        //if success call jwt.sign to generate token
                        jwt.sign({ email: input.email }, "blog-app", { expiresIn: "1d" },
                            (error, token) => {
                                if (error) {
                                    res.json({ "status": "unable to create token" })
                                }
                                else {
                                    res.json({ "status": "success", "userId": response[0]._id, "token": token })
                                 
                                }
                            }
                        )
                    }
                    else {
                        res.json({ "status": "incorrect password" })
                    }
                })
            }
            else {
                res.json({ "status": "user not found" })
            }
        }
    ).catch()
})



app.listen(8080, () => {
    console.log("server running...")
})