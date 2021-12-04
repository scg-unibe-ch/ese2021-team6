export class Order {

  constructor(
    public orderId: number,
    public username: string,
    public deliveryAdress: string,
    public paymentMethod: string,
    public orderStatus: string,
    public productId: number,
  ) {}
}
