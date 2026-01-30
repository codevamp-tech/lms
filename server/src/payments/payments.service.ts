import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Payment, PaymentDocument, PaymentStatus } from "./schemas/payment.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async markSuccess(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return this.paymentModel.findOneAndUpdate(
      { razorpayOrderId: data.razorpayOrderId },
      {
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        status: PaymentStatus.SUCCESS,
      },
      { new: true },
    );
  }

  async findByEnquiry(enquiryId: string) {
    return this.paymentModel.find({ enquiryId });
  }
}
