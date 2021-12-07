export class Order {

  constructor(
    public orderId: number,
    public username: string,
    public deliveryAdress: string,
    public city: string,
    public zipcode: number,
    public paymentMethod: string,
    public orderStatus: string,
    public productId: number,
    public productTitle: string,
    public productPrice: number
  ) {}
}
