import Router from "express"
import fs from "fs"

const cartRouter =Router()
const pathCart = "./carrito.json"


cartRouter.post("/", (req,res)=>{
    //(POST) Crear un nuevo carrito
    try{
        //Leer carrito.json
        let carrito=fs.readFileSync(pathCart, "utf-8")
        let parsedCart= JSON.parse(carrito)
        
        // Genera un nuevo ID autoincrementable
        const ID = parsedCart.length + 1;

        // Estructura del nuevo carrito
        const newCart ={
            id: ID,
            products: []
        }    

         // Agrega el nuevo carrito al array de carritos
        parsedCart.push(newCart)

        let data=JSON.stringify(parsedCart)
        fs.writeFileSync(pathCart, data, null)

        res.status(201).json({message: "Carrito creado exitosamente", cart: newCart })

        }catch (e) {
        console.error("Error al crear el carrito:", e);
        res.status(500).json({ error: "Error del servidor" });
    }
})

cartRouter.get("/:cid/", async(req,res)=>{
    //(GET) Listar productos del carrito
    try{    
        let cid=parseInt(req.params.cid)
        let carrito=fs.readFileSync(pathCart, "utf-8")
        let parsedCart= JSON.parse(carrito)

        let finalCart =parsedCart.find((cart)=>{
            cart.id===cid
        })
        if (!finalCart) {
            res.status(404).json({ error: "Carrito no encontrado" });
        } else {
            res.json(finalCart);
        }
    }catch(e){
        res.status(500).json({error:"Error del servidor"})
    }

})

cartRouter.post("/:cid/products/:pid", (req,res)=>{
    //(POST) Agregar un producto nuevo al carrito

    try {
        let cid = parseInt(req.params.cid);
        let pid = parseInt(req.params.pid);

        let {quantity}=req.body 
        if (!quantity){
            quantity=1
        }

        const data = fs.readFileSync(pathCart, "utf-8");
        let carritos = JSON.parse(data);

        const cartIndex = carritos.findIndex(cart => cart.id === cid);

        if (cartIndex === -1) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }


        const existingProductIndex = carritos[cartIndex].products.findIndex(item => item.product === pid);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, se actualiza la cantidad
            carritos[cartIndex].products[existingProductIndex].quantity += parseInt(quantity);
        } else {
            // Si el producto no existe en el carrito, se agrega al arreglo de productos

            const productToAdd = {
                product: pid,
                quantity: parseInt(quantity)
            };
    
            carritos[cartIndex].products.push(productToAdd);
        }

        fs.writeFileSync(pathCart, JSON.stringify(carritos, null, 2));

        res.json({ message: "Producto agregado al carrito", cart: carritos[cartIndex] });
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
})




export default cartRouter