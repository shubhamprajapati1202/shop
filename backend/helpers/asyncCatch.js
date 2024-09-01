module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req,res,next)).catch(next)
    // try{
    //     theFunc(req, res, next)
    // }catch(error){
    //     next(error)
    // }
}