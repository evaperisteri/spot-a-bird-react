import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile, UserUpdateDTO } from "../api/user";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Edit, Save, X } from "lucide-react";
import { UserProfile } from "../api/user";
import { Button } from "../components/ui/button";

export default function ProfileDetailsPage() {
  const { userId, username } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdateDTO>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const userData = await getUserProfile(userId);
        setUser(userData);
        setFormData({
          firstName: userData.firstname || "",
          lastName: userData.lastname || "",
          email: userData.email || "",
          dateOfBirth: userData.profileDetails?.dateOfBirth || "",
          gender: userData.profileDetails?.gender || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      const updatedUser = await updateUserProfile(formData);
      setUser({
        ...user!,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        profileDetails: updatedUser.profileDetails,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        dateOfBirth: user.profileDetails?.dateOfBirth || "",
        gender: user.profileDetails?.gender || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-rose-800 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple text-white px-4 py-2 rounded-md hover:bg-purple/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center rounded-xl shadow-soft text-purple border border-purple md:p-10 m-4">
        <div className="bg-offwhite overflow-auto shadow-soft rounded-lg border border-lilac/80 px-4 md:px-10">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center px-4 py-5 sm:px-6">
            <div>
              <h3 className="text-xl md:text-4xl text-sage font-logo font-bold tracking-wider">
                {user?.firstname} {user?.lastname}
              </h3>
              <p className="text-gray-500 mt-1">@{username}</p>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-sage text-white px-4 py-2 rounded-md hover:bg-sage/80 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  className="flex px-4 text-white rounded-md transition-colors"
                >
                  <p>
                    <Save className="inline w-4 h-4 mr-2" />
                    Save
                  </p>
                </Button>
                <Button
                  onClick={handleCancel}
                  className="flex px-4 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <p>
                    <X className="inline w-4 h-4 mr-2" />
                    Cancel
                  </p>
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 mb-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="border-t border-lilac/80 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-eggshell/30">
              {/* Firstname Field */}
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="font-bold text-sage text-base md:text-lg">
                  First Name
                </dt>
                <dd className="font-sans mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  ) : (
                    user?.firstname || "Not provided"
                  )}
                </dd>
              </div>

              {/* Lastname Field */}
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="font-bold text-sage text-base md:text-lg">
                  Last Name
                </dt>
                <dd className="font-sans mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  ) : (
                    user?.lastname || "Not provided"
                  )}
                </dd>
              </div>

              {/* Email Field */}
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="font-bold text-sage text-base md:text-lg">
                  Email
                </dt>
                <dd className="font-sans mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  ) : (
                    user?.email || "Not provided"
                  )}
                </dd>
              </div>

              {/* Date of Birth Field */}
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="font-bold text-sage text-base md:text-lg">
                  Date of Birth
                </dt>
                <dd className="font-sans mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  ) : user?.profileDetails?.dateOfBirth ? (
                    new Date(
                      user.profileDetails.dateOfBirth
                    ).toLocaleDateString()
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>

              {/* Gender Field */}
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="font-bold text-sage text-base md:text-lg">
                  Gender
                </dt>
                <dd className="font-sans mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
                    >
                      <option value="">Select gender</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                      <option value="NON_BINARY">Non binary</option>
                      <option value="GENDER_FLUID">Gender Fluid</option>
                    </select>
                  ) : user?.profileDetails?.gender ? (
                    user.profileDetails.gender.charAt(0) +
                    user.profileDetails.gender
                      .slice(1)
                      .toLowerCase()
                      .replace(/_/g, " ")
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
