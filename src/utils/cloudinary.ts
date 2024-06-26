import cloudinaryConfig from "../config/cloundinary";

export const destroyClodinary = async(publicId: string) => {
  try{
    
    const res = await cloudinaryConfig.uploader.destroy(publicId);
    if(res.result === 'ok') {
      console.log('Delete image');
      return true
    }
  }catch(err) {
    console.log(err);
  }
}