const express = require('express')
const upload = require('../middleware/upload')
const {uploadToCloudinary,deleteFromCloudinary, removeFromCloudinary} = require('../services/cloudinary')
const User = require('../models/user')
const cloudinary = require('cloudinary').v2;
    
const router = new express.Router()
router.post("/users",async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save()
        res.status(201).send(user)
    }catch(error){
        res.status(400).send(error)
    }
})// for creating user

// uploading image

router.post("/image/:id", upload.single("userImage"),async(req,res)=>{
    try{
        const data = await uploadToCloudinary(req.file.path,"user-images");
        const saveImg = await User.updateOne(
            {_id:req.params.id},
            {
                $set:{
                    imageUrl : data.url,
                    publicId : data.public_id,
                }
            },
            )
            res.status(200).send("user image uploaded")
    }catch(error){
res.status(400).send(error)
    }
})
// delete user image
router.delete("/image/:id",async(req,res)=>{
    try {
        const user = await User.findOne({_id:req.params.id});
        const publicId = user.publicId;
        await deleteFromCloudinary(publicId);
        const deleteImg = await User.updateOne({_id:req.params.id},
            {
                $set:{
                    imageUrl:"",
                    publicId:"",
                },
            })
            res.status(201).json({ message: "User image uploaded successfully" });
    } catch (error) {
        res.status(400).send(error)
    }
})

// New route to fetch all images
router.get("/images", async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload', // Specify 'upload' to fetch only uploaded images
            prefix: 'user-images/', // Optional: Fetch images with a specific prefix (e.g., folder)
        });

        const images = result.resources.map(resource => ({
            url: resource.secure_url,
            publicId: resource.public_id,
        }));
        res.status(200).json(images);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports=router