import topicModel from "../models/topic.model"

export const createTopic = async (req , res)=>{
    try{
        const topic = await Topic.create({name: req.body.name});
        res.status(201).json(topic);
    }
    catch(error){
        es.status(500).json({error: error.messsage});
    }
}

export const getTopics = async (req, res)=>{
    try {
        const topics = await Topics.find();
        res.status(201).json(topics);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const updateTopic = async (req, res)=>{
    try {
        const topic = await Topic.findByIdAndUpdate(
            req.params.id,
            {name: req.body.name},
            {new: true}
        );
        res.status(201).json(topic);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const deleteTopic = async (req, res)=>{
    try {
        await Topic.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted topic" });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};