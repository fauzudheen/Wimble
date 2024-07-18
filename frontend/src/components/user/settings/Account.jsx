import Buttons from "../misc/Buttons";

const Account = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account security and preferences.</p>
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly for better security.</p>
              </div>
              <button type="button" className={Buttons.tealBlueGradientButton}>
                Change Password
              </button>
            </div>
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                </div>
                <button type="button" className={Buttons.tealBlueGradientButton}>
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Account;