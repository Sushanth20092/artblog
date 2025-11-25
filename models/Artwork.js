import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    status: {
      type: String,
      enum: ["for-sale", "sold", "not-for-sale"],
      default: "for-sale",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    featured: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);
