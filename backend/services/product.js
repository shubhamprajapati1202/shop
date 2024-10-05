const productModel = require("../models/products")
const updateProductStock = (async (id, stock) => {
    try{
        const dbResponse = await productModel.findById(id)

        if(!dbResponse){
            throw new Error(`Product not found`)
        }

        dbResponse.stock -= stock

        await dbResponse.save()

    }catch(error){
        throw error
    }
})

module.exports = {
    updateProductStock
}