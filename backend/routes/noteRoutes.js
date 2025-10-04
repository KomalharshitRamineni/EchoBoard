import express from "express"

const router = express.Router();


router.get("/",(req,res) => {
    res.status(200).send("you just fetched the notes")
});

router.post("/", (req,res) => {
    res.status(201),json({message:"note creates successfully!"})
})

router.put("/:id", (req,res) => {
    res.status(200),json({message:"note updated successfully!"})
})
router.delete("/:id", (req,res) => {
    res.status(200).json({message:"note deleted successfully!"})
})






export default router;