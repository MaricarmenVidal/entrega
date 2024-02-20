import Router from "express"
import fs from "fs"

const productsRouter = Router()
const pathProducts = "./products.json"

productsRouter.get('/', async(req,res)=>{
    //(GET) Todos los productos
    try {
        const data = fs.readFileSync(pathProducts,"utf-8");
        const products = JSON.parse(data);
        const limit = req.query.limit

        let result=products
        if (isNaN(limit)) {
            res.send(products);
        }else {
            result=products.slice(0, limit);
        }

        res.json(result);

    } catch (e) {
        res.status(500).json({ error: "Error del servidor" });
    }
})


productsRouter.get("/:pid", async (req, res) => {
    // (GET) Mostrar el producto coincida con :pid
    try {
        const pid = parseInt(req.params.pid)
        const data = fs.readFileSync(pathProducts,"utf-8")
        const products = JSON.parse(data)
        
        const product = products.find(producto => producto.id === pid);
        
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(product)
        }
    } catch (e) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

productsRouter.post("/add", async (req,res)=>{
    //(POST) Crear producto
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body

        // Campos obligatorios a excepcion del thumbnail
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" })
        }

        const data = fs.readFileSync(pathProducts,"utf-8")
        const products = JSON.parse(data)
        
        // Los datos que se envian al archivo JSON
        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail
        }

        products.push(newProduct)

        // Añadir los productos en el archivo JSON (products.json)
        fs.writeFileSync(pathProducts, JSON.stringify(products, null, 2))

        res.status(201).json({ message: "Producto agregado exitosamente", product: newProduct })
    } catch (e) {
        res.status(500).json({ error: "Error del servidor" })
    }

})

productsRouter.put("/update/:pid/", (req,res)=>{
    //(PUT) Editar producto
    try {
        const pid = parseInt(req.params.pid)
        const updateFields = req.body
        
        //Verificar si no hay escrito nada en el body para actualizar
        if (!Object.keys(updateFields).length) {
            return res.status(400).json({ error: "No hay campos para actualizar" })
        }

        const data = fs.readFileSync(pathProducts,"utf-8")
        let products = JSON.parse(data)

        const index = products.findIndex(product => product.id === pid)
        
        //No se encuentra el id del producto
        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        // Copia el producto encontrado para actualizarlo
        const updatedProduct = { ...products[index] }

        // Actualiza los campos proporcionados
        for (const field in updateFields) {
            if (field !== "id") { 
                // Evita actualizar el id
                updatedProduct[field] = updateFields[field]
            }
        }

        // Actualiza el producto
        products[index] = updatedProduct

        // Guarda el array actualizado de productos en el archivo JSON
        fs.writeFileSync(pathProducts, JSON.stringify(products, null, 2))
        
        //realizado con exito
        res.json({ message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (e) {
        //mensaje de error
        res.status(500).json({ error: "Error del servidor" })
    }
})

productsRouter.delete("/delete/:pid/", async(req,res)=>{
    //(DELETE) Eliminar producto que coincida con :pid
    try{
        const pid = parseInt(req.params.pid)
        const data = fs.readFileSync(pathProducts,"utf-8")
        const products = JSON.parse(data)

        const index = products.findIndex(p => p.id === pid)
        
        //No se encuentra al producto
        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        // Elimina el producto del array de productos
        products.splice(index, 1)

        // Guarda el array actualizado de productos en el archivo JSON
        fs.writeFileSync(pathProducts, JSON.stringify(products, null, 2))

        res.json({ message: "Producto eliminado correctamente" })

    }catch(e){
        res.status(500).json({error: "Error del servidor"})
    }

})


export default productsRouter

