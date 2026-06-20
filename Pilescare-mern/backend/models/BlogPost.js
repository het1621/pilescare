import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  slug:         { type: String, unique: true },
  excerpt:      { type: String, required: true },
  category:     { type: String, default: "Education" },
  read_time:    { type: String, default: "5 min read" },
  cover:        { type: String, required: true },
  content_html: { type: String, required: true, maxlength: [500000, "Content too large (max 500KB)"] },
  published:    { type: Boolean, default: true },
}, { timestamps: true });

blogSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("BlogPost", blogSchema);
