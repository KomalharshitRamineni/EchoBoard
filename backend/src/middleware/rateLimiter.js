import ratelimit from "../config/upstash.js"

const rateLimiter = async (req,res,next) => {
    try {
        // Normally "my-limit-key" would be user id such that limit is applied per user
        // Or you could add based on IP
        // Now this current implementation means that it stops for every one
        const {success} = await ratelimit.limit("my-limit-key");
        if(!success) {
            return res.status(429).json({message:"Too many requests, please try again later"});
        };

        next();
    } catch (error) {
        console.log("Rate limit error ", error);
        next(error);
    }
}
export default rateLimiter