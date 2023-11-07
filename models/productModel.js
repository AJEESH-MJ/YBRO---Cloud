import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, required: true },
    image: {
        data: Buffer,
        contentType: String,
    },
    shipping: { type: Boolean },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);