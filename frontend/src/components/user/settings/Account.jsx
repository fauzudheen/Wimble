import { useState } from "react";
import Buttons from "../misc/Buttons";
import { useSelector } from "react-redux";
import createAxiosInstance from "../../../api/axiosInstance";
import { GatewayUrl } from "../../const/urls";
import { Eye, EyeOff } from "lucide-react";

const Account = () => {
  const [changePasswordSectionOpen, setChangePasswordSectionOpen] = useState(false);
  const token = useSelector(state => state.auth.userAccess);
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePasswordFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post(`${GatewayUrl}api/change-password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccess("Password changed successfully.");
      setChangePasswordSectionOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "An error occurred while changing the password.");
      } else if (error.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account security and preferences.</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly for better security.</p>
              </div>
              <button 
              type="button" 
              onClick={() => setChangePasswordSectionOpen(!changePasswordSectionOpen)}
              className={changePasswordSectionOpen ? Buttons.cancelButton : Buttons.tealBlueGradientButton}>
                {changePasswordSectionOpen ? "Cancel" : "Change Password" }
              </button>
            </div>
            {changePasswordSectionOpen && (
          <form onSubmit={handleChangePasswordFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-[50%] text-sm px-3 py-2 border border-gray-300 dark:border-gray-500 outline-none rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-[50%] text-sm px-3 py-2 border border-gray-300 dark:border-gray-500 outline-none rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-[50%] text-sm px-3 py-2 border border-gray-300 dark:border-gray-500 outline-none rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {showPassword ? "Hide" : "Show"} password
              </span>
            </div>
              {error && (
                <div className="w-[50%] text-sm mt-4 p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:text-red-100 rounded">
                  {error}
                </div>
              )}
            <button
              type="submit"
              className={`${Buttons.tealBlueGradientButton} ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        )}
        {success && (
          <div className="w-[50%] text-sm mt-4 p-3 bg-green-100 border border-green-400 text-green-700 dark:bg-green-800 dark:text-green-100 rounded">
            {success}
          </div>
        )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Account;