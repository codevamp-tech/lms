"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Search, X, Pencil, Trash2, Star, Users, Clock, Upload, Camera } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import {
    createTrainer,
    getTrainers,
    updateTrainer,
    deleteTrainer,
    toggleTrainerStatus,
    Trainer,
    TrainerData,
} from "@/features/api/trainers/route";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TrainersList: React.FC = () => {
    const userId = getUserIdFromToken();
    const { data: user } = useUserProfile(userId);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<TrainerData>({
        name: "",
        email: "",
        phone: "",
        expertise: "",
        bio: "",
        experience: "",
        studentsTaught: "",
        rating: 0,
        photoUrl: "",
        companyId: "",
    });

    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        const storedCompanyId = localStorage.getItem("companyId");
        if (storedCompanyId) {
            setCompanyId(storedCompanyId);
            setFormData((prev) => ({ ...prev, companyId: storedCompanyId }));
        }
    }, []);

    const fetchTrainers = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getTrainers(page, ITEMS_PER_PAGE);
            if (data?.success && Array.isArray(data.trainers)) {
                setTrainers(data.trainers);
                setTotalPages(data.totalPages ?? 1);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch trainers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers(currentPage);
    }, [currentPage]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rating' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageUpload = async (file: File, isEdit: boolean = false) => {
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        setUploading(true);
        try {
            const response = await axios.post(`${API_URL}/images/upload`, formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data?.secure_url) {
                setFormData(prev => ({ ...prev, photoUrl: response.data.secure_url }));
                setPreviewImage(response.data.secure_url);
                toast.success("Photo uploaded successfully!");
            }
        } catch (error) {
            toast.error("Failed to upload photo");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Cloudinary
            handleImageUpload(file, isEdit);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            expertise: "",
            bio: "",
            experience: "",
            studentsTaught: "",
            rating: 0,
            photoUrl: "",
            companyId: companyId || "",
        });
        setPreviewImage("");
    };

    const handleAddTrainer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error("Name and Email are required");
            return;
        }

        try {
            const response = await createTrainer(formData);
            if (response.success) {
                toast.success("Trainer added successfully");
                resetForm();
                setShowAddForm(false);
                fetchTrainers(currentPage);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to add trainer");
        }
    };

    const handleEditClick = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setFormData({
            name: trainer.name,
            email: trainer.email,
            phone: trainer.phone || "",
            expertise: trainer.expertise || "",
            bio: trainer.bio || "",
            experience: trainer.experience || "",
            studentsTaught: trainer.studentsTaught || "",
            rating: trainer.rating || 0,
            photoUrl: trainer.photoUrl || "",
        });
        setPreviewImage(trainer.photoUrl || "");
        setShowEditModal(true);
    };

    const handleUpdateTrainer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTrainer) return;

        try {
            const response = await updateTrainer(selectedTrainer._id, formData);
            if (response.success) {
                toast.success("Trainer updated successfully");
                setShowEditModal(false);
                setSelectedTrainer(null);
                resetForm();
                fetchTrainers(currentPage);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to update trainer");
        }
    };

    const handleDeleteClick = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTrainer) return;

        try {
            const response = await deleteTrainer(selectedTrainer._id);
            if (response.success) {
                toast.success("Trainer deleted successfully");
                setShowDeleteModal(false);
                setSelectedTrainer(null);
                fetchTrainers(currentPage);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to delete trainer");
        }
    };

    const handleToggleStatus = async (trainer: Trainer) => {
        try {
            const response = await toggleTrainerStatus(trainer._id);
            if (response.success) {
                toast.success(response.message);
                setTrainers((prev) =>
                    prev.map((t) =>
                        t._id === trainer._id ? { ...t, isActive: !t.isActive } : t
                    )
                );
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to toggle status");
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const filteredTrainers = trainers.filter(
        (trainer) =>
            trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (trainer.expertise?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading && trainers.length === 0) {
        return <div className="p-6 flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 dark:bg-card min-h-screen">
            {(user?.role === "admin" || user?.role === "superadmin") && (
                <div className="bg-white dark:bg-card rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Trainers Management
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="w-full md:w-72 relative">
                                <div className="flex items-center gap-2 relative">
                                    <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                                    <input
                                        type="text"
                                        placeholder="Search trainers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-8 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Add button */}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowAddForm(!showAddForm);
                                }}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto font-medium"
                            >
                                {showAddForm ? "Cancel" : "+ Add Trainer"}
                            </button>
                        </div>
                    </div>

                    {/* Add Trainer Form */}
                    {showAddForm && (
                        <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Trainer</h3>
                            <form onSubmit={handleAddTrainer} className="space-y-6">
                                {/* Photo Upload */}
                                <div className="flex flex-col items-center md:items-start">
                                    <Label className="mb-2">Trainer Photo</Label>
                                    <div className="relative">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden bg-gray-100 dark:bg-gray-800"
                                        >
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Camera className="w-8 h-8 mx-auto text-gray-400" />
                                                    <span className="text-xs text-gray-500 mt-1">Upload Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e)}
                                        className="hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="expertise">Specialty/Expertise</Label>
                                        <Input
                                            id="expertise"
                                            name="expertise"
                                            value={formData.expertise}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder="e.g., IELTS & TOEFL Expert"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="experience">Experience</Label>
                                        <Input
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder="e.g., 3+ years"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="studentsTaught">Students Taught</Label>
                                        <Input
                                            id="studentsTaught"
                                            name="studentsTaught"
                                            value={formData.studentsTaught}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder="e.g., 1350+"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="rating">Rating (0-5)</Label>
                                        <Input
                                            id="rating"
                                            name="rating"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        placeholder="Brief description about the trainer..."
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={uploading}
                                    >
                                        Save Trainer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Trainers Grid */}
                    <div className="p-6">
                        {filteredTrainers.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">
                                    {searchTerm
                                        ? "No trainers match your search."
                                        : "No trainers found. Click 'Add Trainer' to create one."}
                                </p>
                            </div>
                        ) : (
                            <div>
                                {/* Card Grid View */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredTrainers.map((trainer) => (
                                        <div
                                            key={trainer._id}
                                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                                        >
                                            {/* Status Badge */}
                                            <div className="relative">
                                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${trainer.isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                    }`}>
                                                    {trainer.isActive ? "Active" : "Inactive"}
                                                </div>
                                            </div>

                                            {/* Photo and Name */}
                                            <div className="pt-6 pb-4 px-4 text-center border-b dark:border-gray-700">
                                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900">
                                                    {trainer.photoUrl ? (
                                                        <img
                                                            src={trainer.photoUrl}
                                                            alt={trainer.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                                            {trainer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    {trainer.name}
                                                </h3>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                    {trainer.expertise || "Trainer"}
                                                </p>
                                            </div>

                                            {/* Stats */}
                                            <div className="px-4 py-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <Clock size={16} className="text-gray-400" />
                                                    <span>{trainer.experience || "N/A"} Experience</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <Users size={16} className="text-gray-400" />
                                                    <span>{trainer.studentsTaught || "0"} Students Taught</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                    <span className="font-semibold text-gray-800 dark:text-white">
                                                        {trainer.rating ? `${trainer.rating}/5.0` : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                                                <button
                                                    onClick={() => handleToggleStatus(trainer)}
                                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${trainer.isActive
                                                            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400"
                                                            : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400"
                                                        }`}
                                                >
                                                    {trainer.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(trainer)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(trainer)}
                                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col md:flex-row md:justify-center items-center gap-3 mt-8">
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-gray-600 dark:text-gray-300 px-4">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedTrainer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold dark:text-white">
                                Edit Trainer
                            </h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedTrainer(null);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTrainer} className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden bg-gray-100 dark:bg-gray-800"
                                    >
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="w-8 h-8 mx-auto text-gray-400" />
                                                <span className="text-xs text-gray-500 mt-1">Upload Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, true)}
                                    className="hidden"
                                />
                                <p className="text-sm text-gray-500 mt-2">Click to change photo</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-name">Name *</Label>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-email">Email *</Label>
                                    <Input
                                        id="edit-email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                        id="edit-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-expertise">Specialty/Expertise</Label>
                                    <Input
                                        id="edit-expertise"
                                        name="expertise"
                                        value={formData.expertise}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-experience">Experience</Label>
                                    <Input
                                        id="edit-experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                        placeholder="e.g., 3+ years"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-studentsTaught">Students Taught</Label>
                                    <Input
                                        id="edit-studentsTaught"
                                        name="studentsTaught"
                                        value={formData.studentsTaught}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                        placeholder="e.g., 1350+"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-rating">Rating (0-5)</Label>
                                    <Input
                                        id="edit-rating"
                                        name="rating"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edit-bio">Bio</Label>
                                <textarea
                                    id="edit-bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedTrainer(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={uploading}
                                >
                                    Update Trainer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedTrainer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">
                                Delete Trainer
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to delete{" "}
                                <strong>{selectedTrainer.name}</strong>? This action cannot be
                                undone.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedTrainer(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainersList;
