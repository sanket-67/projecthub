const asyncHandler = (fn) => async(req,res,next)=>{
try {
   
  await fn(req,res,next)  

} catch (error) {
 const message =  error.message||"something went wrong"
 const statusCode = error.statusCode || 500

res.status(statusCode).json({
message,
statusCode





})
}
}

export default asyncHandler ;
