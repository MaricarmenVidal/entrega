import express from "express";
import productsRouter from "./routes/productsRouter.js"
import cartRouter from "./routes/cartRouter.js"


const app = express()
const port =8080

//Middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())



//Routes
app.use('/api/products/', productsRouter)
app.use('/api/cart/', cartRouter)



app.listen(port, ()=>console.log("Servidor corriendo en " + port))
