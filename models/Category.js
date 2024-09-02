import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent : {type : mongoose.Types.ObjectId , ref :'Category'},
    properties : [{type : Object}],
    products: [{ type: mongoose.Types.ObjectId, ref: 'Products' }], // أضف هذا السطر
});

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
