import { redisClient } from "../../dbs/init.redis";
import { verifyToken } from "../../middleware/auth.middleware";

export const removeToken = async(tokenSecret: string, tokenId: string) => {
    try {
        const token = await redisClient.get(tokenId);
        
        if (tokenSecret && token) {
            
            let user = await verifyToken(tokenSecret, token);
            
            if(user.user ) {
                await redisClient.del(tokenId);
                return user.user
            }else {
                return 0;
            }
                    
        } else {
            return 0;
        }
        
    }catch(err) {
        console.error(err);
        
    }
}