
async function userinfo(req,res,next) {
    console.log('inside userinfo..')
    console.log(res.user);
    console.log(req.user);
    res.status(200).json({'status':'ok'});
}

module.exports={
    userinfo,
}