const Resources = require("../models/Resources");

let createResources = async (req, res) => {
  try {
    const resource = await new Resources(req.body);
    await resource.save();
    res.json({ msg: "Resource added" });
  } catch (err) {
    console.log(err);
    res.json({ msg: "error in adding resources" });
  }
};

let getResources = async (req, res) => {
  try {
    const resources = await Resources.find();
    res.json(resources);
  } catch {
    res.json({ msg: "error in getting resoursces" });
  }
};

let getResource = async (req, res) => {
  try {
    const resource = await Resources.findById(req.params.id);
    res.json({ resource });
  } catch (err) {
    console.log(err);

    res.json({ msg: "error in getting resource" });
  }
};


let updateResources = async (req,res)=>{
    try{
        const resource = await Resources.findByIdAndUpdate(req.params.id,req.body)
        res.json({"msg":"resource updated"})
    }
    catch{
        res.json({"msg":"error in updation"})
    }
}

let deleteResource = async (req,res)=>{
    try{
        await Resources.findByIdAndDelete(req.params.id)
        res.json({"msg":"resource deleted"})
    }
    catch{
        res.json({"msg":"error in deleting"})
    }
}
module.exports = { createResources, getResources, getResource , updateResources, deleteResource};
