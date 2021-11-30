import {upload} from '../middlewares/fileFilter';
import {Post} from '../models/post.model';
import {ItemImage, ItemImageAttributes} from '../models/itemImage.model';
import {MulterRequest} from '../models/multerRequest.model';
import { Product } from '../models/product.model';

export class ItemService {

    public addImage(req: MulterRequest): Promise<ItemImageAttributes> {
        return Post.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Product not found!');
                } else {
                    return new Promise<ItemImageAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            ItemImage.create({ imageId: found.postId, fileName: req.file.filename })
                                .then(created => resolve(created))
                                .catch(() => reject('Could not upload image!'));
                        });
                    });
                }
            })
            .catch(() => Promise.reject('Could not upload image!'));
    }

    public addProductImage(req: MulterRequest): Promise<ItemImageAttributes> {
        return Product.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Product not found!');
                } else {
                    return new Promise<ItemImageAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            ItemImage.create({ imageId: found.productId, fileName: req.file.filename })
                                .then(created => resolve(created))
                                .catch(() => reject('Could not upload image!'));
                        });
                    });
                }
            })
            .catch(() => Promise.reject('Could not upload image!'));
    }

    public getImageItem(imageId: number): Promise<ItemImage> {
        console.log(imageId);
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
