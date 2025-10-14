"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { imageUpload } from "@/features/api/image-upload/route";
import toast from "react-hot-toast";

const EditConfigurationForm = () => {
  const router = useRouter();

  // State for storing companyId retrieved from localStorage.
  const [companyId, setCompanyId] = useState<string>("");

  // State for configuration data.
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    phone: "",
    billingAddress: "",
  });

  // States for loading, image file, configuration's _id, preview and progress.
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [configId, setConfigId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");


  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    } else {
      console.warn("CompanyId not found in localStorage");
    }
  }, []);


  useEffect(() => {
    if (!companyId) return;

    const fetchConfigData = async () => {
      try {
        const response = await fetch(
          `https://lms-v4tz.onrender.com/configurations/company/${companyId}`
        );
        const data = await response.json();

        const config = Array.isArray(data) ? data[0] : data;
        if (config) {
          setConfigId(config._id);
          setFormData({
            name: config.name || "",
            website: config.website || "",
            email: config.email || "",
            phone: config.phone || "",
            billingAddress: config.billingAddress || "",
          });
          // Optionally, if a configuration image exists, display it.
          if (config.image) {
            setImagePreview(config.image);
            setImageUrl(config.image); // Ensure existing image URL is retained
          }
        }
      } catch (error) {
        console.error("Error fetching configuration data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, [companyId]);

  // Handle text input changes.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the image file input and upload it
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
      setImageUploading(true);

      // Upload the image
      const uploadedUrl = await imageUpload(file);

      if (uploadedUrl) {
        setImageUrl(uploadedUrl?.secure_url); // Store uploaded image URL
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image!");
    } finally {
      setImageUploading(false);
    }
  };

  // Handle form submission to update (or create) the configuration.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!companyId) {
        toast.error("Company ID is missing!");
        setLoading(false);
        return;
      }

      const updatedData = {
        company_id: companyId, // 🔥 Ensure company_id is included
        ...formData,
        image: imageUrl, // Uploaded image URL
      };


      const url = configId
        ? `https://lms-v4tz.onrender.com/configurations/${configId}`
        : `https://lms-v4tz.onrender.com/configurations/create`;

      const response = await fetch(url, {
        method: configId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update configuration");

      const result = await response.json();
      toast.success("Configuration updated successfully!");
      router.push("/admin/configuration");
    } catch (error) {
      console.error("Error updating configuration:", error);
      toast.error("Error updating configuration!");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="text-center py-4">Loading configuration...</div>;

  return (
    <div className="h-[450px] w-full overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-2 bg-card rounded-lg">
        <div className="grid grid-cols-2 gap-1">
          <div className="grid gap-4">
            {imagePreview && (
              <div className="mt-4 pl-24">
                <p className="mb-2 font-bold pl-2">Image Preview:</p>
                <img src={imagePreview} alt="Image Preview" className="w-60 h-56 rounded shadow" />
              </div>
            )}

            {/* Show upload progress if the image is uploading */}
            {imageUploading && (
              <div className="mt-4 w-64 ">
                <p>Image upload progress: {uploadProgress}%</p>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          <div className="grid gap-4">
            <Input
              className="w-full p-2 border rounded-md"
              placeholder="Configuration Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              className="w-full p-2 border rounded-md"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              className="w-full p-2 border rounded-md"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              className="w-full p-2 border rounded-md"
              placeholder="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
            <Input
              className="w-full p-2 border rounded-md"
              placeholder="Billing Address"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              required
            />
            {/* Image Input */}
            <Input
              className="w-full p-2 border rounded-md"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>

        {/* Display image preview if available */}


        <div className="flex p-4 mt-4">
          <Button disabled={loading} type="submit">
            {loading ? "Updating..." : "Update Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditConfigurationForm;
