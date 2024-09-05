import { useEffect, useMemo, useState } from "react";
import createAxiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { GatewayUrl } from "../../const/urls";

const Notifications = () => {
  const [notificationPreferences, setNotificationPreferences] = useState({
    follows: false,
    likes: false,
    comments: false,
    meetings: false,
    system: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const token = useSelector((state) => state.auth.userAccess);
  const axiosInstance = useMemo(() => createAxiosInstance(token), [token]);

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const response = await axiosInstance.get(`${GatewayUrl}api/notification-preferences/`);
        setNotificationPreferences(response.data);
      } catch (error) {
        console.error("Error fetching notification preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotificationPreferences();
  }, [axiosInstance]);

  const handlePreferenceChange = async (event) => {
    const { name, checked } = event.target;
    setUpdating(name);
    try {
      const updatedPreferences = { ...notificationPreferences, [name]: checked };
      await axiosInstance.put(`${GatewayUrl}api/notification-preferences/`, updatedPreferences);
      setNotificationPreferences(updatedPreferences);
    } catch (error) {
      console.error(`Error updating ${name} preference:`, error);
      // Revert the change in UI if the update fails
      setNotificationPreferences((prev) => ({ ...prev, [name]: !checked }));
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage how you receive notifications.</p>
        <div className="mt-6">
          <fieldset>
            <legend className="text-base font-medium text-gray-900 dark:text-white">By App</legend>
            <div className="mt-4 space-y-4">
              {Object.entries(notificationPreferences).map(([key, value]) => {
                if (key === "id" || key === "user") return null;
                return (
                  <div key={key} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={key}
                        name={key}
                        type="checkbox"
                        checked={value}
                        onChange={handlePreferenceChange}
                        disabled={updating === key}
                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={key} className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get notified about {key}.
                        {updating === key && <span className="ml-2 text-teal-500">Updating...</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default Notifications;