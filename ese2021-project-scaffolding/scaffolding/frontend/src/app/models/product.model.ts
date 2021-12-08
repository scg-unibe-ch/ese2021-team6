export class Product {

  constructor(
    public productId: number,
    public title: string,
    public description: string,
    public category: string,
    public price: number,
    public imageId: number,
    public imagePath: string,
    public userId: number,
    public createdAt: string,
  ) {}
}
