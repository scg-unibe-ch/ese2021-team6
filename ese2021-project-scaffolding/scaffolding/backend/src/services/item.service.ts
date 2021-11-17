import {upload} from '../middlewares/fileFilter';
import {Post} from '../models/post.model';
import {ItemImage, ItemImageAttributes} from '../models/itemImage.model';
import {MulterRequest} from '../models/multerRequest.model';

export class ItemService {

    public addImage(req: MulterRequest): Promise<ItemImageAttributes> {
        console.log('From itemService:');
        console.log(req.params);
        const name = String(req.body.filename);
        console.log(name);
        return Post.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Product not found!');
                } else {
                    return new Promise<ItemImageAttributes>((resolve, reject) => {
                        console.log(req.file);
                        upload.single('image')(req, null, (error: any) => {
                            ItemImage.create({ fileName: req.file.filename, postId: found.postId })
                                .then(created => resolve(created))
                                .catch(() => reject('Could not upload image!'));
                        });
                    });
                }
            })
            .catch(() => Promise.reject('Could not upload image!'));
    }

    public getImageItem(imageId: number): Promise<ItemImage> {
        return ItemImage.findByPk(imageId)
            .then(image => {
                if (image) {
                    return Promise.resolve(image);
                } else {
                    return Promise.reject('image not found!');
                }
            })
            .catch(() => Promise.reject('could not fetch the image!'));
    }
}
